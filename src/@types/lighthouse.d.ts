// We just declare this module because there are no lighthouse
// type definitions.
declare module "lighthouse" {
  export default lighthouse => Promise<any>;
}
