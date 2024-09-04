import {ApiProperty} from "@nestjs/swagger";

export class UrlShortenDTO {
  @ApiProperty({
    example: "https://www2.gov.bc.ca/gov/content/environment",
    description: "The URL for which short URL is to be generated",
    required: true,
    format: "url",
  })
  url: string;
  @ApiProperty({
    example: "W0jsiQdywoj",
    description: "Random 12 character string, if not provided, system will generate it.",
    maxLength: 12,
    minLength: 12,
    reuired: false
  })
  customUrlCode?: string;
}
