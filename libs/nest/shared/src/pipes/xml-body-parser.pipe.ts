import { BadRequestException, Injectable, PipeTransform } from '@nestjs/common';
import { X2jOptionsOptional, XMLParser } from 'fast-xml-parser';

@Injectable()
export class XmlBodyParserPipe implements PipeTransform {
  private parser: XMLParser;

  constructor(options?: X2jOptionsOptional) {
    this.parser = new XMLParser(
      Object.assign(
        {
          ignoreAttributes: false,
          allowBooleanAttributes: true,
          parseAttributeValue: true,
          trimValues: true,
        },
        options,
      ),
    );
  }

  public transform(value: string | Buffer) {
    try {
      return this.parser.parse(value);
    } catch (err) {
      throw new BadRequestException('Invalid XML payload');
    }
  }
}
