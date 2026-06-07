// Maps Hebrew product names to categories using keywords
// Used by all supermarket seed scripts
export function getCategory(productName: string): string {
    const name = productName.toLowerCase();

    if (/חלב|גבינה|יוגורט|שמנת|קוטג|לבן|בולגרית/.test(name)) return 'מוצרי חלב';
    if (/עוף|חזה|שניצל|כנפיים|ירך|בשר|כבש|טלה|סטייק|בקר/.test(name)) return 'בשר ועוף';
    if (/לחם|פיתה|בגט|חלה|לחמנייה|קרואסון|מאפה/.test(name)) return 'לחם ומאפים';
    if (/תפוח|בננה|עגבנייה|מלפפון|גזר|תות|אבוקדו|פלפל|ברוקולי|לימון/.test(name)) return 'פירות וירקות';
    if (/מיץ|קולה|ספרייט|פנטה|מים|סודה|בירה|יין/.test(name)) return 'משקאות';
    if (/שמפו|סבון|קרם|דאודורנט|משחת שיניים|נייר טואלט/.test(name)) return 'טיפוח וניקיון';
    if (/קפה|תה|סוכר|קמח|שמן|מלח|אורז|פסטה|רוטב/.test(name)) return 'מזווה';
    if (/ביצ|ביצים/.test(name)) return 'ביצים';
    if (/גלידה|שוקולד|חטיף|ופל|עוגייה|סוכריה|במבה|ביסלי/.test(name)) return 'חטיפים וממתקים';
    if (/דג|סלמון|טונה|בקלה/.test(name)) return 'דגים';

    // No keyword matched — return general
    return 'כללי';
}
