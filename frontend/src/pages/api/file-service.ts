export const downloadTemplateFile = async (libraryModule: string) => {
    if (!libraryModule || libraryModule.length < 1) {
        throw new Error("No Library Module Selected.");
    }
    const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/library/${libraryModule}/download-template-file`,
        {
            method: "GET",
            headers: {
                Accept: "text/csv",
            },
        }
    );
    if (!response.ok) {
        throw new Error("Failed to download template file.");
    }
    const blob = await response.blob();

    const url = window.URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = `${libraryModule}_template_file.csv`;
    document.body.appendChild(a);
    a.click();

    a.remove();
    window.URL.revokeObjectURL(url);
};
//Function to export the assets
export const exportLibraryDataCSV = async (libraryModule: string) => {
    if (!libraryModule || libraryModule.length < 1) {
        throw new Error("No Library Module Selected.");
    }
    const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/library/${libraryModule}/export`,
        {
            method: "GET",
            headers: {
                Accept: "text/csv",
            },
        }
    );
    if (!response.ok) {
        throw new Error("Failed to export.");
    }
    const blob = await response.blob();

    const url = window.URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = `${libraryModule}_exports.csv`;
    document.body.appendChild(a);
    a.click();

    a.remove();
    window.URL.revokeObjectURL(url);
};

//Function to export the assets
export const importLibraryDataCSV = async (libraryModule: string, file: File): Promise<any> => {

    if (!libraryModule || libraryModule.length < 1) {
        throw new Error("No Library Module Selected.");
    }

    if (!file) {
        throw new Error("No file selected.");
    }

    const formData = new FormData();
    formData.append("file", file);

    const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/library/${libraryModule}/import`,
        {
            method: "POST",
            body: formData,
        }
    );

    if (!res.ok) {
        throw new Error("Failed to import.");
    }

    const response = await res.json();
    console.log(response)
    return response;
};