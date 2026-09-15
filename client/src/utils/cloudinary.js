export const toDownloadUrl = (url) => {
    return url.replace("/upload/", "/upload/fl_attachment/");
};