import React from "react";

const Logo: React.FC<{ viewport: "desktop" | "mobile" }> = ({ viewport }) => {
  return (
    <svg
      width="114"
      height="24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-labelledby={`provider-logo-title-${viewport}`}
      role="img"
    >
      <title id={`provider-logo-title-${viewport}`}>
        Fewlines logo - Go back to homepage
      </title>
      <path
        d="M4.12 18.809a.567.567 0 0 0 0 .553l.064.113a.603.603 0 0 1 .026.048l1.957 3.493a.534.534 0 0 0 .465.276h2.131a.534.534 0 0 0 .465-.276l4.289-7.652c.155-.277-.039-.622-.349-.622H6.71a.534.534 0 0 0-.465.276l-2.125 3.79zM24.093 9.902l-.947-1.689a.8.8 0 0 0-.697-.414H10.755a.8.8 0 0 0-.696.414l-2.46 4.39c-.156.277.038.622.348.622h16.331a.534.534 0 0 0 .465-.276l.374-.667a.567.567 0 0 0 0-.553l-1.024-1.827z"
        fill="#1825AA"
      />
      <path
        d="M20.598 6.282h.537c.413 0 .67-.46.464-.829l-2.418-4.316a.8.8 0 0 0-.697-.415H6.79a.8.8 0 0 0-.697.415L.233 11.594a.85.85 0 0 0 0 .828L2.65 16.74a.529.529 0 0 0 .929 0L9.22 6.697a.8.8 0 0 1 .697-.414h10.681zM32.904 7.888h1.487c.35 0 .547.203.547.563v2.118c0 .361-.197.564-.547.564h-1.487v7.459c0 .36-.197.563-.547.563h-2.188c-.35 0-.547-.203-.547-.563v-7.46h-.919c-.35 0-.546-.202-.546-.563V8.451c0-.36.196-.563.546-.563h.92c0-2.997 1.508-4.845 4.768-4.845.35 0 .547.225.547.586v2.118c0 .36-.197.541-.569.541-.897 0-1.465.518-1.465 1.6zM47.407 13.521c0 .293-.021.564-.043.834-.044.36-.263.518-.591.518h-7.305c.397 1.34 1.418 1.87 2.558 1.87.612 0 1.225-.225 1.619-.563.219-.18.394-.293.678-.293l2.1-.022c.394 0 .613.27.438.63-.854 1.961-2.647 2.975-4.879 2.975-3.631 0-5.95-2.591-5.95-5.949 0-3.357 2.407-5.949 5.863-5.949 3.194 0 5.512 2.547 5.512 5.95zm-3.266-1.216c-.338-1.283-1.303-1.736-2.268-1.736-1.23 0-2.08.612-2.419 1.736h4.687zM63.443 7.888c.394 0 .569.248.46.63l-3.15 10.164c-.088.315-.329.473-.635.473h-2.1c-.306 0-.547-.158-.635-.473l-1.161-3.748-1.157 3.748c-.088.315-.328.473-.635.473H52.33c-.306 0-.547-.158-.634-.473l-3.15-10.163c-.11-.383.066-.631.46-.631h2.361c.307 0 .526.135.613.473l1.702 6.533 1.243-4.143-.691-2.232c-.11-.383.065-.631.459-.631h1.706c.306 0 .525.158.613.473l1.854 6.152 1.602-6.152c.088-.338.285-.473.612-.473h2.363zM66.069 18.592V3.494c0-.36.197-.564.546-.564h2.188c.35 0 .547.203.547.564v15.098c0 .36-.197.563-.547.563h-2.188c-.35 0-.546-.203-.546-.563zM72.303 5.973V3.944c0-.36.197-.563.547-.563h2.188c.35 0 .547.203.547.563v2.029c0 .36-.197.563-.547.563H72.85c-.35 0-.546-.203-.546-.563zm0 12.619V8.452c0-.361.197-.564.547-.564h2.188c.35 0 .547.203.547.563v10.14c0 .361-.197.564-.547.564H72.85c-.35 0-.546-.203-.546-.563zM88.163 12.012v6.58c0 .36-.196.563-.547.563H85.43c-.35 0-.547-.203-.547-.563v-6.287c0-1.127-.634-1.623-1.466-1.623-.984 0-1.596.563-1.596 1.893v6.017c0 .36-.197.563-.547.563h-2.188c-.35 0-.547-.203-.547-.563V8.452c0-.361.197-.564.547-.564h2.188c.35 0 .547.203.547.563v.466c.514-.783 1.445-1.345 2.843-1.345 2.035 0 3.5 1.623 3.5 4.44zM101.661 13.521c0 .293-.022.564-.043.834-.044.36-.263.518-.591.518h-7.305c.397 1.34 1.418 1.87 2.558 1.87.612 0 1.225-.225 1.619-.563.218-.18.393-.293.678-.293l2.1-.022c.394 0 .612.27.437.63-.853 1.961-2.647 2.975-4.878 2.975-3.631 0-5.95-2.591-5.95-5.949 0-3.357 2.406-5.949 5.863-5.949 3.193 0 5.512 2.547 5.512 5.95zm-3.266-1.216c-.338-1.283-1.303-1.736-2.268-1.736-1.23 0-2.081.612-2.419 1.736h4.687zM112.687 15.775c0 2.591-2.144 3.695-4.55 3.695-2.231 0-4.244-1.036-4.506-3.425-.044-.383.175-.586.524-.586h2.144c.329 0 .438.18.591.474.175.383.591.608 1.247.608.919 0 1.269-.316 1.269-.766 0-1.623-5.71-.135-5.71-4.507 0-2.546 2.144-3.696 4.441-3.696 2.034 0 4.025 1.037 4.287 3.426.044.383-.175.586-.525.586h-2.143c-.328 0-.438-.18-.591-.496-.153-.36-.525-.586-1.028-.586-.81 0-1.159.315-1.159.766 0 1.667 5.709.113 5.709 4.507z"
        fill="#1825AA"
      />
    </svg>
  );
};

export { Logo };
