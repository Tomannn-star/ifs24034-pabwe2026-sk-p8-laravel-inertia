/**
 * Normalize heading levels inside rendered Markdown so they start at
 * `baseLevel` and never skip levels (prevents Axe `heading-order` violations).
 */
export function normalizeViewerHeadings(container, baseLevel = 2) {
    if (!container) return;

    const headings = container.querySelectorAll('h1, h2, h3, h4, h5, h6');
    let prevLevel = baseLevel - 1;

    headings.forEach((el) => {
        const rawLevel = Number(el.tagName.slice(1));
        const clampedMin = Math.max(baseLevel, rawLevel);
        const targetLevel = Math.min(6, Math.min(clampedMin, prevLevel + 1));
        prevLevel = targetLevel;

        if (targetLevel === rawLevel) return;

        const replacement = document.createElement(`h${targetLevel}`);
        for (const attr of el.attributes) {
            replacement.setAttribute(attr.name, attr.value);
        }
        while (el.firstChild) {
            replacement.appendChild(el.firstChild);
        }
        el.replaceWith(replacement);
    });
}
