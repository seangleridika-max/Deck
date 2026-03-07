class ContentExtractor {
  title = '';
  content: string[] = [];

  element(element: Element) {
    const tag = element.tagName;

    if (tag === 'h1' && !this.title) {
      element.onEndTag(() => {
        this.title = element.getAttribute('data-text') || '';
      });
    }

    if (['p', 'h2', 'h3', 'li'].includes(tag)) {
      element.onEndTag(() => {
        const text = element.getAttribute('data-text') || '';
        if (text.length > 20) {
          this.content.push(text);
        }
      });
    }
  }

  text(text: Text) {
    if (text.lastInTextNode) {
      const content = text.text.trim();
      if (content) {
        text.before(`<span data-text="${content.replace(/"/g, '&quot;')}">`);
        text.after('</span>');
      }
    }
  }
}

export async function extractContent(url: string): Promise<{ title: string; content: string; url: string }> {
  const response = await fetch(url, {
    headers: {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
    }
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch: ${response.status}`);
  }

  const extractor = new ContentExtractor();

  const rewriter = new HTMLRewriter()
    .on('script, style, nav, header, footer, aside, iframe', {
      element(element) {
        element.remove();
      }
    })
    .on('h1, h2, h3, p, li', extractor)
    .on('h1, h2, h3, p, li', {
      text: extractor.text.bind(extractor)
    });

  await rewriter.transform(response).text();

  return {
    title: extractor.title,
    content: extractor.content.join('\n\n'),
    url
  };
}
