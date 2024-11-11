export class Email {
  from!: string;
  to!: string;
  subject!: string;
  text!: string;
  html!: string;

  constructor(
    from: string,
    to: string,
    subject: string,
    text: string,
    html: string
  ) {
    this.from = from;
    this.to = to;
    this.html = html;
    this.subject = subject;
    this.text = text;
  }
}
