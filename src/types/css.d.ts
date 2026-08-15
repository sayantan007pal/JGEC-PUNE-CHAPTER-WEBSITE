declare module "*.css" {
  const content: { [className: string]: string };
  export default content;
}

declare module "*.JPEG" {
  const content: import("next/image").StaticImageData;
  export default content;
}
