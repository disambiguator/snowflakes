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
  }
}
