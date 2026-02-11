import { DownloadOnlyFileViewer } from "./DownloadOnlyFileViewer";
import { ImageViewer } from "./ImageViewer";
import { PDFViewer } from "./PDFViewer";

interface FileViewerProps {
  fileUrl: string;
  filename: string;
  fileType: string;
  title?: string;
}

export function FileViewer({
  fileUrl,
  filename,
  fileType,
  title,
}: Readonly<FileViewerProps>) {
  const normalizedFileType = fileType.toLowerCase().replace(".", "");

  if (normalizedFileType === "pdf") {
    return <PDFViewer fileUrl={fileUrl} fileName={filename} title={title} />;
  }

  if (
    ["png", "jpg", "jpeg", "gif", "webp", "svg"].includes(normalizedFileType)
  ) {
    return (
      <ImageViewer
        fileUrl={fileUrl}
        fileName={filename}
        experimentName={title || "Image"}
      />
    );
  }

  if (["docx", "doc", "xlsx", "xls"].includes(normalizedFileType)) {
    return (
      <DownloadOnlyFileViewer
        fileUrl={fileUrl}
        filename={filename}
        fileType={normalizedFileType}
      />
    );
  }

  return (
    <div className="flex items-center justify-center h-full">
      <div className="text-center text-muted-foreground">
        <p className="text-lg font-medium">Unsupported file type</p>
        <p className="text-sm mt-2">
          Cannot preview .{normalizedFileType} files
        </p>
        <p className="text-xs mt-4 text-muted-foreground/70">
          Supported formats: PDF, PNG, JPG, JPEG, GIF, WEBP, SVG, DOC, DOCX,
          XLS, XLSX
        </p>
      </div>
    </div>
  );
}
