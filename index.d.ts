declare module "*.glsl" {
  const content: string;
  export default content;
}
declare module "*.vert" {
  const content: string;
  export default content;
}
declare module "*.frag" {
  const content: string;
  export default content;
}
declare namespace NodeJS {
  interface ProcessEnv {
    REGION: string;
    ACCESS_KEY: string;
    SECRET_KEY: string;
    AIRTABLE_API_KEY: string;
    AIRTABLE_BASE: string;
    BUCKET_NAME: string;
  }
}
