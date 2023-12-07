
/**
 * Formata CNPJs e CPFs.
 */
export default function formatDocument(document: string) {
   return document.length === 11 ? document.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.$2.$3-$4") : document.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, '$1.$2.$3/$4-$5')
}