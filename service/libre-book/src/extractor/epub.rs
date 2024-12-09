use epub::doc::EpubDoc;
use image::DynamicImage;

use crate::models::NewBook;

pub fn get_metadata(epub_buffer: Vec<u8>) -> Option<(NewBook, DynamicImage)> {
    // 创建 Cursor 并从中读取 EpubDoc
    let cursor = std::io::Cursor::new(epub_buffer);
    let mut epub_doc = EpubDoc::from_reader(cursor).ok()?;

    let title = epub_doc.mdata("title")?;

    let author = epub_doc.mdata("creator")
        .or(epub_doc.mdata("author"));

    let book = NewBook {
        title,
        author,
        description: None,
        added_date: chrono::Local::now().naive_local().date(),
    };

    let (cover_data, _) = epub_doc.get_cover().unwrap_or_default();

    let cover = image::load_from_memory(&cover_data).unwrap_or_default();

    Some((book, cover))
}