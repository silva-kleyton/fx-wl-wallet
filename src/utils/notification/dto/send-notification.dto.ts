import {IEmailConsumerBody} from './email';
import {ISMSConsumerBody} from './sms';
import {IWhatsappConsumerBody} from './whatsapp';
import {EnumTemplates} from './templates';

export enum EMessageType {
    Email = 'email',
    SMS = 'sms',
    WhatsApp = 'whatsapp'
}

export interface IMessageTemplate {
    type: EnumTemplates,
    variables: { [key: string]: string | number | boolean | Date };
}

export interface IMessageConsumer {
    type: EMessageType;
    template?: IMessageTemplate;
    data: IEmailConsumerBody | ISMSConsumerBody | IWhatsappConsumerBody;
}

export default {EMessageType};
