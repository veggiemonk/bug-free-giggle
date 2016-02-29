export default function *(next) {
 const start = new Date;
 yield next;
 const ms = new Date - start;
 console.log( '%s %s - %s', this.method, this.url, ms );
 }

