import {Body, Controller, Get, HttpException, HttpStatus, Logger, Param, Post, Res} from '@nestjs/common';
import {AppService} from './app.service';
import {UrlShortenDTO} from "./dto/url.shorten";
import {Response} from "express";
import {ApiExcludeEndpoint, ApiTags} from "@nestjs/swagger";
import {escape, isAlphanumeric, isURL} from "validator";
@ApiTags('turl')
@Controller()
export class AppController {
  private logger = new Logger("AppController");

  constructor(private readonly appService: AppService) {
  }

  @ApiExcludeEndpoint()
  @Get()
  async getHello(): Promise<string> {
    return this.appService.getHello();
  }

  @Get('/:shortURL')
  async getURL(@Param('shortURL') url: string, @Res() res: Response): Promise<void> {
    const originalURL = await this.appService.getURL(url);
    if (!originalURL) {
      throw new HttpException("URL not found", HttpStatus.NOT_FOUND);
    } else {
      res.redirect(originalURL);
    }
  }

  @Post()
  async postUrlShorten(@Body() urlShortenDTO: UrlShortenDTO): Promise<string> {
    if (!this.isValidURL(urlShortenDTO.url)) {
      throw new HttpException("Invalid URL", HttpStatus.BAD_REQUEST);
    }
    if (urlShortenDTO.customUrlCode && urlShortenDTO.customUrlCode.length != 12 && !isAlphanumeric(urlShortenDTO.customUrlCode)) {
      throw new HttpException("Custom URL code is not 12 characters alphanumeric", HttpStatus.BAD_REQUEST);
    }
    try {
      const shortUrlCode = await this.appService.postURLShorten(urlShortenDTO.url, urlShortenDTO.customUrlCode);
      return (process.env.APP_URL || 'http://localhost:3000/') + escape(shortUrlCode);
    } catch (e) {
      throw new HttpException({
        status: HttpStatus.INTERNAL_SERVER_ERROR,
        error: 'This is a custom message',
      }, HttpStatus.INTERNAL_SERVER_ERROR, {
        cause: e
      });
    }
  }

  private isValidURL(url: string) {
    const isValidUrl = (url && isURL(url));
    this.logger.debug(`URL ${url} is ${isValidUrl}`);
    return isValidUrl;
  }
}
