import { chromium } from "playwright";

export async function webService(url) {
    const browser = await chromium.launch({ headless: true });
    const page = await browser.newPage();

    try {
        await page.goto(url, { waitUntil: "domcontentloaded" });

        const pageData = await page.evaluate(() => {
            const getMetaContent = (...selectors) => {
                for (const selector of selectors) {
                    const element = document.querySelector(selector);
                    const content = element?.getAttribute("content")?.trim();
                    if (content) {
                        return content;
                    }
                }

                return null;
            };

            const resolveUrl = (value) => {
                if (!value) {
                    return null;
                }

                try {
                    return new URL(value, window.location.href).href;
                } catch {
                    return value;
                }
            };

            const imageCandidates = [
                getMetaContent('meta[property="og:image:secure_url"]', 'meta[name="og:image:secure_url"]'),
                getMetaContent('meta[property="og:image"]', 'meta[name="og:image"]'),
                getMetaContent('meta[name="twitter:image"]', 'meta[property="twitter:image"]'),
                document.querySelector('link[rel="image_src"]')?.getAttribute("href")?.trim() || null,
            ]
                .map(resolveUrl)
                .filter(Boolean);

            const visibleImages = Array.from(document.images)
                .map((image) => {
                    const rect = image.getBoundingClientRect();
                    const width = rect.width || image.naturalWidth || 0;
                    const height = rect.height || image.naturalHeight || 0;

                    return {
                        src: resolveUrl(image.currentSrc || image.src),
                        area: width * height,
                    };
                })
                .filter((image) => image.src && image.area > 0)
                .sort((left, right) => right.area - left.area);

            const title = document.title?.trim() || "";
            const content = document.body?.innerText?.trim() || "";
            const thumbnail = imageCandidates[0] || visibleImages[0]?.src || null;

            return {
                title,
                content,
                thumbnail,
            };
        });
        return {
            platform: "web",
            description: `${pageData.title} ${pageData.content}`.trim(),
            thumbnail: pageData.thumbnail,
        };
    } finally {
        await browser.close();
    }
}