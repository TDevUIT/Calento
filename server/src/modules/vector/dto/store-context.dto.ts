export class StoreContextDto {
  userId: string;
  context: Record<string, any>;
  embedding?: number[];
  textToEmbed?: string;
}
