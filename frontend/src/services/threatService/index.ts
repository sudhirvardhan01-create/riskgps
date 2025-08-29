import { downloadThreatsTemplate, exportThreats, fetchThreats, importThreats } from '@/pages/api/threat'

export const ThreatService = {
    fetch : (page: number, limit: number, searchPattern: string, sort: string) => fetchThreats(page, limit, searchPattern, sort),
    export : (endpoint: string) => exportThreats(endpoint),
    download: () => downloadThreatsTemplate(),
    import: (file: File) => importThreats(file),
}