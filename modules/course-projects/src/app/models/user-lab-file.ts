import {Attachment} from './attachment.model';

export class UserLabFile {
  Id: string;
  Date: string;
  Comments: string;
  Attachments: Attachment[];
}