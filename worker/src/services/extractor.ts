import * as cheerio from 'cheerio';

export async function extractContent(url: string): Promise<{ title: string; content: string; url: string }> {
  const response = await fetch(url, {
    headers: {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
    }
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch: ${response.status}`);
  }

  const html = await response.text();
  const $ = cheerio.load(html);

  // 移除广告和无关元素
  $('script, style, nav, header, footer, aside, iframe, .ad, .advertisement, .sidebar, #sidebar, .comments, #comments').remove();

  // 提取标题
  const title = $('h1').first().text().trim() || $('title').text().trim();

  // 提取正文内容
  const content: string[] = [];

  // 常见新闻网站的正文选择器
  const selectors = ['article', 'main', '.article-content', '.post-content', '[role="main"]', '.content', 'body'];

  for (const selector of selectors) {
    const $el = $(selector);
    if ($el.length > 0) {
      $el.find('p, h2, h3, li').each((_, el) => {
        const text = $(el).text().trim();
        if (text.length > 20) {
          content.push(text);
        }
      });
      if (content.length > 0) break;
    }
  }

  return {
    title,
    content: content.join('\n\n'),
    url
  };
}
