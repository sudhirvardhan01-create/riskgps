import { downloadTemplateFile, exportLibraryDataCSV, importLibraryDataCSV } from "@/pages/api/file-service"


export const FileService = {
    dowloadCSVTemplate: (libraryModule: string) => downloadTemplateFile(libraryModule),
    exportLibraryDataCSV: (libraryModule: string) => exportLibraryDataCSV(libraryModule),
    importLibraryDataCSV: (libraryModule: string, file: File) => importLibraryDataCSV(libraryModule, file),
};
