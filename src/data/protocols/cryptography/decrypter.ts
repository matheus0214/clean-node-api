export interface Decrypter {
  decrypt: (data: string) => Promise<string>
}
