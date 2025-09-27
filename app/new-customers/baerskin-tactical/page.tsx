import { ComposableAbout, type ComposableAboutProps } from "./about";
import { ComposableCaseStudy } from "./content";
import { ComposableHeader } from "./header";
import { BaerskinLogo } from "./header";
import { getRandomPatterns } from "./patterns";

// Import placeholder images from content.tsx
function PlaceholderImage() {
  return (
    <svg
      width="385"
      height="777"
      viewBox="0 0 385 777"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="h-auto w-full max-w-[120px] md:mx-auto md:max-w-[385px]"
    >
      <g clipPath="url(#clip0_321_29285)">
        <path
          d="M255.87 86.484C279.267 86.484 298.233 67.5176 298.233 44.1214C298.233 20.7252 279.267 1.75879 255.87 1.75879C232.474 1.75879 213.508 20.7252 213.508 44.1214C213.508 67.5176 232.474 86.484 255.87 86.484Z"
          stroke="#0C0A09"
          strokeWidth="3.51665"
          strokeMiterlimit="10"
        />
        <path
          d="M44.1211 44.1211H213.506"
          stroke="#0C0A09"
          strokeWidth="3.51665"
          strokeMiterlimit="10"
        />
        <path
          d="M298.2 44.1211H340.563"
          stroke="#0C0A09"
          strokeWidth="3.51665"
          strokeMiterlimit="10"
        />
        <path
          d="M44.1211 171.177H128.814"
          stroke="#0C0A09"
          strokeWidth="3.51665"
          strokeMiterlimit="10"
          strokeDasharray="10.58 10.58"
        />
        <path
          d="M128.812 171.177H213.505"
          stroke="#0C0A09"
          strokeWidth="3.51665"
          strokeMiterlimit="10"
          strokeDasharray="10.58 10.58"
        />
        <path
          d="M298.2 171.177H340.563"
          stroke="#0C0A09"
          strokeWidth="3.51665"
          strokeMiterlimit="10"
        />
        <path
          d="M255.87 213.54C279.267 213.54 298.233 194.573 298.233 171.177C298.233 147.781 279.267 128.814 255.87 128.814C232.474 128.814 213.508 147.781 213.508 171.177C213.508 194.573 232.474 213.54 255.87 213.54Z"
          stroke="#0C0A09"
          strokeWidth="3.51665"
          strokeMiterlimit="10"
        />
        <path
          d="M240.894 186.122L270.85 156.198"
          stroke="#0C0A09"
          strokeWidth="3.51665"
          strokeMiterlimit="10"
        />
        <path
          d="M240.894 156.198L270.85 186.122"
          stroke="#0C0A09"
          strokeWidth="3.51665"
          strokeMiterlimit="10"
        />
        <path
          d="M255.87 325.681C279.267 325.681 298.233 306.715 298.233 283.319C298.233 259.922 279.267 240.956 255.87 240.956C232.474 240.956 213.508 259.922 213.508 283.319C213.508 306.715 232.474 325.681 255.87 325.681Z"
          stroke="#0C0A09"
          strokeWidth="3.51665"
          strokeMiterlimit="10"
        />
        <path
          d="M240.894 298.296L270.85 268.34"
          stroke="#0C0A09"
          strokeWidth="3.51665"
          strokeMiterlimit="10"
        />
        <path
          d="M240.894 268.34L270.85 298.296"
          stroke="#0C0A09"
          strokeWidth="3.51665"
          strokeMiterlimit="10"
        />
        <path
          d="M255.87 437.856C279.267 437.856 298.233 418.89 298.233 395.493C298.233 372.097 279.267 353.131 255.87 353.131C232.474 353.131 213.508 372.097 213.508 395.493C213.508 418.89 232.474 437.856 255.87 437.856Z"
          stroke="#0C0A09"
          strokeWidth="3.51665"
          strokeMiterlimit="10"
        />
        <path
          d="M240.894 410.471L270.85 380.515"
          stroke="#0C0A09"
          strokeWidth="3.51665"
          strokeMiterlimit="10"
        />
        <path
          d="M240.894 380.515L270.85 410.471"
          stroke="#0C0A09"
          strokeWidth="3.51665"
          strokeMiterlimit="10"
        />
        <path
          d="M255.87 550.03C279.267 550.03 298.233 531.064 298.233 507.667C298.233 484.271 279.267 465.305 255.87 465.305C232.474 465.305 213.508 484.271 213.508 507.667C213.508 531.064 232.474 550.03 255.87 550.03Z"
          stroke="#0C0A09"
          strokeWidth="3.51665"
          strokeMiterlimit="10"
        />
        <path
          d="M240.894 522.613L270.85 492.688"
          stroke="#0C0A09"
          strokeWidth="3.51665"
          strokeMiterlimit="10"
        />
        <path
          d="M240.894 492.688L270.85 522.613"
          stroke="#0C0A09"
          strokeWidth="3.51665"
          strokeMiterlimit="10"
        />
        <path
          d="M255.87 662.172C279.267 662.172 298.233 643.205 298.233 619.809C298.233 596.413 279.267 577.446 255.87 577.446C232.474 577.446 213.508 596.413 213.508 619.809C213.508 643.205 232.474 662.172 255.87 662.172Z"
          stroke="#0C0A09"
          strokeWidth="3.51665"
          strokeMiterlimit="10"
        />
        <path
          d="M240.894 634.787L270.85 604.863"
          stroke="#0C0A09"
          strokeWidth="3.51665"
          strokeMiterlimit="10"
        />
        <path
          d="M240.894 604.863L270.85 634.787"
          stroke="#0C0A09"
          strokeWidth="3.51665"
          strokeMiterlimit="10"
        />
        <path
          d="M255.87 774.347C279.267 774.347 298.233 755.381 298.233 731.985C298.233 708.588 279.267 689.622 255.87 689.622C232.474 689.622 213.508 708.588 213.508 731.985C213.508 755.381 232.474 774.347 255.87 774.347Z"
          stroke="#0C0A09"
          strokeWidth="3.51665"
          strokeMiterlimit="10"
        />
        <path
          d="M240.894 746.962L270.85 717.006"
          stroke="#0C0A09"
          strokeWidth="3.51665"
          strokeMiterlimit="10"
        />
        <path
          d="M240.894 717.006L270.85 746.962"
          stroke="#0C0A09"
          strokeWidth="3.51665"
          strokeMiterlimit="10"
        />
        <path
          d="M382.924 128.814C382.924 152.194 363.973 171.177 340.562 171.177"
          stroke="#0C0A09"
          strokeWidth="3.51665"
          strokeMiterlimit="10"
        />
        <path
          d="M340.562 44.1211C363.941 44.1211 382.924 63.0719 382.924 86.4837"
          stroke="#0C0A09"
          strokeWidth="3.51665"
          strokeMiterlimit="10"
        />
        <path
          d="M382.923 86.4512V128.814"
          stroke="#0C0A09"
          strokeWidth="3.51665"
          strokeMiterlimit="10"
        />
        <path
          d="M1.75879 86.4515C1.75879 63.0723 20.7096 44.0889 44.1214 44.0889"
          stroke="#0C0A09"
          strokeWidth="3.51665"
          strokeMiterlimit="10"
        />
        <path
          d="M44.1214 171.177C20.7422 171.177 1.75879 152.226 1.75879 128.814"
          stroke="#0C0A09"
          strokeWidth="3.51665"
          strokeMiterlimit="10"
        />
        <path
          d="M44.1211 286.119H128.814"
          stroke="#0C0A09"
          strokeWidth="3.51665"
          strokeMiterlimit="10"
          strokeDasharray="10.58 10.58"
        />
        <path
          d="M128.812 286.119H213.505"
          stroke="#0C0A09"
          strokeWidth="3.51665"
          strokeMiterlimit="10"
          strokeDasharray="10.58 10.58"
        />
        <path
          d="M44.1214 286.118C20.7422 286.118 1.75879 267.168 1.75879 243.756"
          stroke="#0C0A09"
          strokeWidth="3.51665"
          strokeMiterlimit="10"
        />
        <path
          d="M44.1211 400.116H128.814"
          stroke="#0C0A09"
          strokeWidth="3.51665"
          strokeMiterlimit="10"
          strokeDasharray="10.58 10.58"
        />
        <path
          d="M128.812 400.116H213.505"
          stroke="#0C0A09"
          strokeWidth="3.51665"
          strokeMiterlimit="10"
          strokeDasharray="10.58 10.58"
        />
        <path
          d="M44.1214 400.116C20.7422 400.116 1.75879 381.166 1.75879 357.754"
          stroke="#0C0A09"
          strokeWidth="3.51665"
          strokeMiterlimit="10"
        />
        <path
          d="M44.1211 508.613H128.814"
          stroke="#0C0A09"
          strokeWidth="3.51665"
          strokeMiterlimit="10"
          strokeDasharray="10.58 10.58"
        />
        <path
          d="M128.812 508.613H213.505"
          stroke="#0C0A09"
          strokeWidth="3.51665"
          strokeMiterlimit="10"
          strokeDasharray="10.58 10.58"
        />
        <path
          d="M44.1214 508.612C20.7422 508.612 1.75879 489.661 1.75879 466.249"
          stroke="#0C0A09"
          strokeWidth="3.51665"
          strokeMiterlimit="10"
        />
        <path
          d="M44.1211 622.61H128.814"
          stroke="#0C0A09"
          strokeWidth="3.51665"
          strokeMiterlimit="10"
          strokeDasharray="10.58 10.58"
        />
        <path
          d="M128.812 622.61H213.505"
          stroke="#0C0A09"
          strokeWidth="3.51665"
          strokeMiterlimit="10"
          strokeDasharray="10.58 10.58"
        />
        <path
          d="M44.1214 622.611C20.7422 622.611 1.75879 603.66 1.75879 580.248"
          stroke="#0C0A09"
          strokeWidth="3.51665"
          strokeMiterlimit="10"
        />
        <path
          d="M44.1211 731.105H128.814"
          stroke="#0C0A09"
          strokeWidth="3.51665"
          strokeMiterlimit="10"
          strokeDasharray="10.58 10.58"
        />
        <path
          d="M128.812 731.105H213.505"
          stroke="#0C0A09"
          strokeWidth="3.51665"
          strokeMiterlimit="10"
          strokeDasharray="10.58 10.58"
        />
        <path
          d="M44.1214 731.106C20.7422 731.106 1.75879 712.155 1.75879 688.743"
          stroke="#0C0A09"
          strokeWidth="3.51665"
          strokeMiterlimit="10"
        />
        <path
          d="M1.75879 128.814V86.4512"
          stroke="#0C0A09"
          strokeWidth="3.51665"
          strokeMiterlimit="10"
        />
        <path
          d="M1.75879 245.678V130.605"
          stroke="#0C0A09"
          strokeWidth="3.51665"
          strokeMiterlimit="10"
        />
        <path
          d="M1.75879 359.676V244.604"
          stroke="#0C0A09"
          strokeWidth="3.51665"
          strokeMiterlimit="10"
        />
        <path
          d="M1.75879 467.552V352.479"
          stroke="#0C0A09"
          strokeWidth="3.51665"
          strokeMiterlimit="10"
        />
        <path
          d="M1.75879 581.55V466.478"
          stroke="#0C0A09"
          strokeWidth="3.51665"
          strokeMiterlimit="10"
        />
        <path
          d="M1.75879 693.106V578.033"
          stroke="#0C0A09"
          strokeWidth="3.51665"
          strokeMiterlimit="10"
        />
        <path
          d="M235.629 43.4941H279.666"
          stroke="#0C0A09"
          strokeWidth="3.52"
          strokeMiterlimit="10"
        />
        <path
          d="M254.001 24.0003L234 43.332L254.001 62.6638"
          stroke="#292524"
          strokeWidth="3.52"
        />
      </g>
      <defs>
        <clipPath id="clip0_321_29285">
          <rect width="384.682" height="776.105" fill="white" />
        </clipPath>
      </defs>
    </svg>
  );
}

function PlaceholderImage2() {
  return (
    <svg
      width="542"
      height="401"
      viewBox="0 0 542 401"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect width="542" height="401" fill="url(#pattern0_321_29280)" />
      <defs>
        <pattern
          id="pattern0_321_29280"
          patternContentUnits="objectBoundingBox"
          width="1"
          height="1"
        >
          <use transform="matrix(0.000731079 0 0 0.000988142 -0.0760906 0)" />
        </pattern>
        <image
          id="image0_321_29280"
          width="1576"
          height="1012"
          preserveAspectRatio="none"
        />
      </defs>
    </svg>
  );
}

function PlaceholderImage3() {
  return (
    <svg
      width="385"
      height="777"
      viewBox="0 0 385 777"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="h-auto w-full max-w-[120px] md:mx-auto md:max-w-[385px]"
    >
      <g clipPath="url(#clip0_697_9570)">
        <path
          d="M255.87 86.484C279.267 86.484 298.233 67.5176 298.233 44.1214C298.233 20.7252 279.267 1.75879 255.87 1.75879C232.474 1.75879 213.508 20.7252 213.508 44.1214C213.508 67.5176 232.474 86.484 255.87 86.484Z"
          stroke="#0C0A09"
          strokeWidth="3.51665"
          strokeMiterlimit="10"
        />
        <path
          d="M44.1211 44.1211H213.506"
          stroke="#0C0A09"
          strokeWidth="3.51665"
          strokeMiterlimit="10"
        />
        <path
          d="M298.2 44.1211H340.563"
          stroke="#0C0A09"
          strokeWidth="3.51665"
          strokeMiterlimit="10"
        />
        <path
          d="M44.1211 171.177H128.814"
          stroke="#0C0A09"
          strokeWidth="3.51665"
          strokeMiterlimit="10"
          strokeDasharray="10.58 10.58"
        />
        <path
          d="M128.812 171.177H213.505"
          stroke="#0C0A09"
          strokeWidth="3.51665"
          strokeMiterlimit="10"
          strokeDasharray="10.58 10.58"
        />
        <path
          d="M298.2 171.177H340.563"
          stroke="#0C0A09"
          strokeWidth="3.51665"
          strokeMiterlimit="10"
        />
        <path
          d="M255.87 662.172C279.267 662.172 298.233 643.205 298.233 619.809C298.233 596.413 279.267 577.446 255.87 577.446C232.474 577.446 213.508 596.413 213.508 619.809C213.508 643.205 232.474 662.172 255.87 662.172Z"
          stroke="#0C0A09"
          strokeWidth="3.51665"
          strokeMiterlimit="10"
        />
        <path
          d="M255.87 774.347C279.267 774.347 298.233 755.381 298.233 731.985C298.233 708.588 279.267 689.622 255.87 689.622C232.474 689.622 213.508 708.588 213.508 731.985C213.508 755.381 232.474 774.347 255.87 774.347Z"
          stroke="#0C0A09"
          strokeWidth="3.51665"
          strokeMiterlimit="10"
        />
        <path
          d="M238.937 44.1211H277.034"
          stroke="#0C0A09"
          strokeWidth="3.51665"
          strokeMiterlimit="10"
        />
        <path
          d="M263.066 61.0526C263.587 60.2386 263.359 59.1315 262.512 58.6105L239.752 44.1206L262.512 29.6307C263.326 29.1097 263.587 28.0026 263.066 27.1886C262.545 26.3746 261.438 26.1466 260.624 26.6351L235.519 42.6228C234.998 42.9484 234.705 43.502 234.705 44.1206C234.705 44.7393 234.998 45.2928 235.519 45.6185L260.624 61.6062C260.917 61.8016 261.243 61.8667 261.568 61.8667C262.154 61.8667 262.708 61.5736 263.066 61.0526Z"
          fill="#0C0A09"
        />
        <path
          d="M382.924 128.814C382.924 152.194 363.973 171.177 340.562 171.177"
          stroke="#0C0A09"
          strokeWidth="3.51665"
          strokeMiterlimit="10"
        />
        <path
          d="M340.562 44.1211C363.941 44.1211 382.924 63.0719 382.924 86.4837"
          stroke="#0C0A09"
          strokeWidth="3.51665"
          strokeMiterlimit="10"
        />
        <path
          d="M382.923 86.4512V128.814"
          stroke="#0C0A09"
          strokeWidth="3.51665"
          strokeMiterlimit="10"
        />
        <path
          d="M1.75879 86.4515C1.75879 63.0723 20.7096 44.0889 44.1214 44.0889"
          stroke="#0C0A09"
          strokeWidth="3.51665"
          strokeMiterlimit="10"
        />
        <path
          d="M44.1214 171.177C20.7422 171.177 1.75879 152.226 1.75879 128.814"
          stroke="#0C0A09"
          strokeWidth="3.51665"
          strokeMiterlimit="10"
        />
        <path
          d="M44.1211 286.119H128.814"
          stroke="#0C0A09"
          strokeWidth="3.51665"
          strokeMiterlimit="10"
          strokeDasharray="10.58 10.58"
        />
        <path
          d="M128.812 286.119H213.505"
          stroke="#0C0A09"
          strokeWidth="3.51665"
          strokeMiterlimit="10"
          strokeDasharray="10.58 10.58"
        />
        <path
          d="M44.1214 286.118C20.7422 286.118 1.75879 267.168 1.75879 243.756"
          stroke="#0C0A09"
          strokeWidth="3.51665"
          strokeMiterlimit="10"
        />
        <path
          d="M44.1211 400.116H128.814"
          stroke="#0C0A09"
          strokeWidth="3.51665"
          strokeMiterlimit="10"
          strokeDasharray="10.58 10.58"
        />
        <path
          d="M128.812 400.116H213.505"
          stroke="#0C0A09"
          strokeWidth="3.51665"
          strokeMiterlimit="10"
          strokeDasharray="10.58 10.58"
        />
        <path
          d="M44.1214 400.116C20.7422 400.116 1.75879 381.166 1.75879 357.754"
          stroke="#0C0A09"
          strokeWidth="3.51665"
          strokeMiterlimit="10"
        />
        <path
          d="M44.1211 508.613H128.814"
          stroke="#0C0A09"
          strokeWidth="3.51665"
          strokeMiterlimit="10"
          strokeDasharray="10.58 10.58"
        />
        <path
          d="M128.812 508.613H213.505"
          stroke="#0C0A09"
          strokeWidth="3.51665"
          strokeMiterlimit="10"
          strokeDasharray="10.58 10.58"
        />
        <path
          d="M44.1214 508.612C20.7422 508.612 1.75879 489.661 1.75879 466.249"
          stroke="#0C0A09"
          strokeWidth="3.51665"
          strokeMiterlimit="10"
        />
        <path
          d="M44.1211 622.61H128.814"
          stroke="#0C0A09"
          strokeWidth="3.51665"
          strokeMiterlimit="10"
          strokeDasharray="10.58 10.58"
        />
        <path
          d="M128.812 622.61H213.505"
          stroke="#0C0A09"
          strokeWidth="3.51665"
          strokeMiterlimit="10"
          strokeDasharray="10.58 10.58"
        />
        <path
          d="M44.1214 622.611C20.7422 622.611 1.75879 603.66 1.75879 580.248"
          stroke="#0C0A09"
          strokeWidth="3.51665"
          strokeMiterlimit="10"
        />
        <path
          d="M44.1211 731.105H128.814"
          stroke="#0C0A09"
          strokeWidth="3.51665"
          strokeMiterlimit="10"
          strokeDasharray="10.58 10.58"
        />
        <path
          d="M128.812 731.105H213.505"
          stroke="#0C0A09"
          strokeWidth="3.51665"
          strokeMiterlimit="10"
          strokeDasharray="10.58 10.58"
        />
        <path
          d="M44.1214 731.106C20.7422 731.106 1.75879 712.155 1.75879 688.743"
          stroke="#0C0A09"
          strokeWidth="3.51665"
          strokeMiterlimit="10"
        />
        <path
          d="M1.75879 128.814V86.4512"
          stroke="#0C0A09"
          strokeWidth="3.51665"
          strokeMiterlimit="10"
        />
        <path
          d="M1.75879 245.678V130.605"
          stroke="#0C0A09"
          strokeWidth="3.51665"
          strokeMiterlimit="10"
        />
        <path
          d="M1.75879 359.676V244.604"
          stroke="#0C0A09"
          strokeWidth="3.51665"
          strokeMiterlimit="10"
        />
        <path
          d="M1.75879 467.552V352.479"
          stroke="#0C0A09"
          strokeWidth="3.51665"
          strokeMiterlimit="10"
        />
        <path
          d="M1.75879 581.55V466.478"
          stroke="#0C0A09"
          strokeWidth="3.51665"
          strokeMiterlimit="10"
        />
        <path
          d="M1.75879 693.106V578.033"
          stroke="#0C0A09"
          strokeWidth="3.51665"
          strokeMiterlimit="10"
        />
        <path
          d="M255.87 549.725C279.267 549.725 298.233 530.759 298.233 507.363C298.233 483.966 279.267 465 255.87 465C232.474 465 213.508 483.966 213.508 507.363C213.508 530.759 232.474 549.725 255.87 549.725Z"
          stroke="#0C0A09"
          strokeWidth="3.51665"
          strokeMiterlimit="10"
        />
        <path
          d="M255.87 437.725C279.267 437.725 298.233 418.759 298.233 395.363C298.233 371.966 279.267 353 255.87 353C232.474 353 213.508 371.966 213.508 395.363C213.508 418.759 232.474 437.725 255.87 437.725Z"
          stroke="#0C0A09"
          strokeWidth="3.51665"
          strokeMiterlimit="10"
        />
        <path
          d="M255.87 324.725C279.267 324.725 298.233 305.759 298.233 282.363C298.233 258.966 279.267 240 255.87 240C232.474 240 213.508 258.966 213.508 282.363C213.508 305.759 232.474 324.725 255.87 324.725Z"
          stroke="#0C0A09"
          strokeWidth="3.51665"
          strokeMiterlimit="10"
        />
        <path
          d="M255.87 211.725C279.267 211.725 298.233 192.759 298.233 169.363C298.233 145.966 279.267 127 255.87 127C232.474 127 213.508 145.966 213.508 169.363C213.508 192.759 232.474 211.725 255.87 211.725Z"
          stroke="#0C0A09"
          strokeWidth="3.51665"
          strokeMiterlimit="10"
        />
        <path
          d="M248.951 189.59L278.8 152"
          stroke="#0C0A09"
          strokeWidth="3.50391"
          strokeMiterlimit="10"
        />
        <path
          d="M235 169.569L251.319 189.304"
          stroke="#0C0A09"
          strokeWidth="3.50391"
          strokeMiterlimit="10"
        />
        <path
          d="M248.951 304.59L278.8 267"
          stroke="#0C0A09"
          strokeWidth="3.50391"
          strokeMiterlimit="10"
        />
        <path
          d="M235 284.569L251.319 304.304"
          stroke="#0C0A09"
          strokeWidth="3.50391"
          strokeMiterlimit="10"
        />
        <path
          d="M248.951 413.59L278.8 376"
          stroke="#0C0A09"
          strokeWidth="3.50391"
          strokeMiterlimit="10"
        />
        <path
          d="M235 393.569L251.319 413.304"
          stroke="#0C0A09"
          strokeWidth="3.50391"
          strokeMiterlimit="10"
        />
        <path
          d="M248.951 523.59L278.8 486"
          stroke="#0C0A09"
          strokeWidth="3.50391"
          strokeMiterlimit="10"
        />
        <path
          d="M235 503.569L251.319 523.304"
          stroke="#0C0A09"
          strokeWidth="3.50391"
          strokeMiterlimit="10"
        />
        <path
          d="M248.951 638.59L278.8 601"
          stroke="#0C0A09"
          strokeWidth="3.50391"
          strokeMiterlimit="10"
        />
        <path
          d="M235 618.569L251.319 638.304"
          stroke="#0C0A09"
          strokeWidth="3.50391"
          strokeMiterlimit="10"
        />
        <path
          d="M248.951 748.59L278.8 711"
          stroke="#0C0A09"
          strokeWidth="3.50391"
          strokeMiterlimit="10"
        />
        <path
          d="M235 728.569L251.319 748.304"
          stroke="#0C0A09"
          strokeWidth="3.50391"
          strokeMiterlimit="10"
        />
      </g>
      <defs>
        <clipPath id="clip0_697_9570">
          <rect width="384.682" height="776.105" fill="white" />
        </clipPath>
      </defs>
    </svg>
  );
}

// Interfaces for the complete page structure
interface Requirement {
  label: string;
  description: string;
}

interface QuoteBlock {
  quote: string;
  author: string;
  company: string;
  highlightedWords?: string[];
}

interface NumberedSection {
  number: string;
  text: string;
  highlightedText?: string;
}

type ContentBlock =
  | { type: "paragraph"; content: string; imagePath?: string }
  | {
      type: "requirements";
      requirements: Requirement[];
      defaultSymbol?: "X" | "✓";
      imagePath?: string;
    }
  | { type: "quote"; quote: QuoteBlock; imagePath?: string }
  | { type: "label"; content: string; imagePath?: string }
  | { type: "numbered"; numbered: NumberedSection; imagePath?: string }
  | {
      type: "cta";
      ctaText: string;
      ctaDescription?: string;
      imagePath?: string;
    };

interface ContentSectionData {
  id: string;
  title: string;
  header: string;
  contentBlocks: ContentBlock[];
  image?: React.ReactNode;
}

interface ComposableCaseStudyProps {
  intro: {
    title: string;
    logo: React.ReactNode;
  };
  sections: ContentSectionData[];
  footer: {
    title: string;
    subtitle: string;
    ctaText: string;
  };
}

interface InfoBlockData {
  header: string;
  description: string;
}

interface CompanyDetailsData {
  website: {
    prefix: string;
    url: string;
    link?: string; // Optional full URL for linking
    isLinked?: boolean; // Whether to make it a clickable link
  };
  logo: React.ReactNode;
  description: string;
}

interface BackgroundPatterns {
  left: React.ReactNode;
  right: React.ReactNode;
}

interface ComposableHeaderProps {
  title: string;
  highlightedText?: string;
  subtitle: string;
  backgroundPatterns: BackgroundPatterns;
  infoBlocks: InfoBlockData[];
  companyDetails: CompanyDetailsData;
  backgroundColor?: string;
}

interface CaseStudyPageProps {
  header: ComposableHeaderProps;
  about: ComposableAboutProps;
  content: ComposableCaseStudyProps;
}

// Default Baerskin data
const randomPatterns = getRandomPatterns();
const BAERSKIN_PAGE_DATA: CaseStudyPageProps = {
  header: {
    title: "How BÆRSkin Tactical Supply Co. achieved ",
    highlightedText: "100% event deliverability",
    subtitle: " by switching from Kafka to Inngest.",
    backgroundColor: "#E2E2E2",
    backgroundPatterns: {
      left: <randomPatterns.left />,
      right: <randomPatterns.right />,
    },
    infoBlocks: [
      {
        header: "Case Study:",
        description: "BÆRSkin Tactical Supply Co.",
      },
      {
        header: "Use Cases:",
        description: "Analytics + Operational Data Processing",
      },
      {
        header: "Industry:",
        description: "E-Commerce",
      },
      {
        header: "Employees:",
        description: "20—100",
      },
    ],
    companyDetails: {
      website: {
        prefix: "[www]",
        url: "baerskintactical.com",
        link: "https://baerskintactical.com",
        isLinked: true,
      },
      logo: <BaerskinLogo />,
      description:
        "Data-driven e-commerce platform powering 17 brand operating in 19 countries across the world.",
    },
  },
  about: {
    testimonial: {
      quote:
        "We figured out we were losing roughly 6% of events going through Kafka with customers complaining they didn't get their order confirmation emails, it was super hard to tackle. Now that we switched to Inngest, we're super confident that everything is working as what I'll call tip-top shape.",
      highlightedParts: [
        "we were losing roughly 6% of events going through Kafka",
        "Now that we switched to Inngest, we're super confident that everything is working",
      ],
      author: "Gus Fune → CTO",
      title: "CTO",
      company: "[ BÆRSkin Tactical Supply Co. ]",
      image: "/assets/customers/baerskin/gusDither.png",
      imageAlt: "Gus Fune, CTO",
    },
    cta: {
      primaryText: "Interested in Inngest?",
      secondaryText: "Talk to an Inngest product expert today.",
      buttonText: "Get in touch [+]",
    },
    backgroundColor: "stone-800",
  },
  content: {
    intro: {
      title:
        "Founded in 2019, BÆRSkin Tactical Supply Co. created notable military-grade outdoor gear for adventurers, gathering up to 30,000 reviews on Trustpilot. Starting with the viral BÆRSkin Tactical Hoodie, they expanded to modular, weather-resistant gear designed to work hard, last long, and be comfortable both on the trail and at home. Their products, from 10-pocket fleece hoodies to the BÆR-Kit system, are built for reliability—no fashion statements or disposable junk—just durable gear for wild comfort.",
      logo: <BaerskinLogo />,
    },
    sections: [
      {
        id: "first",
        title: "BUILDING AN IN-HOUSE E-COMMERCE PLATFORM",
        header:
          "BÆRSkin Tactical Supply Co. adopted a unique approach to e-commerce, taking data-driven decisions to target niche markets worldwide. This strategy is backed by the choice to build an in-house e-commerce platform, bringing them complete flexibility and control of the shopping experience compared to solutions like Shopify:",
        contentBlocks: [
          {
            type: "quote",
            quote: {
              author: "Gus Fune → CTO",
              company: "[ BÆRSkin Tactical Supply Co. ]",
              quote:
                "We ended up developing our own e-commerce platform in-house. So we didn't use Shopify or anything like that because we want to keep control of a few elements that they don't allow us to control, like checkout",
            },
          },
          {
            type: "paragraph",
            content:
              "BÆRSkin Tactical Supply Co. is built as a multi-cloud and multi-region event-driven system, composed of analytics systems used internally to make data-driven decisions, as well as operational data processing that powers core e-commerce features, such as order processing and logistics. \n\n In late 2024, Gus and his team started to face issues with their recent Kafka replatforming (migrating an existing application without major rewrites).",
          },
        ],
        image: <PlaceholderImage2 />,
      },
      {
        id: "second",
        title: "THE KAFKA REPLATFORMING FAILURE: 6% EVENT LOSS",
        header:
          "BÆRSkin Tactical Supply Co. adopted Kafka in late 2023 to power their analytics and order processing systems. As the replatforming progressed, they realized that some events were dropped, resulting in customers' complaints about missing orders.",
        contentBlocks: [
          {
            type: "paragraph",
            content:
              "Events dropped by Kafka, combined with its lack of native production tooling, made it hard for the engineering team to identify the root cause and impact on customers. Facing this challenge, Gus started to research a new technology to replace Kafka, matching the following requirements:",
          },
          {
            type: "requirements",
            requirements: [
              {
                label: "Reliability:",
                description:
                  "Events should be delivered reliably and can be replayed in case of processing issues. Producing and consuming events should be scalable without requiring extra infrastructure work.",
              },
              {
                label: "Event-driven:",
                description:
                  "The researched solution needs to match BÆRSkin Tactical Supply Co.'s event-driven architecture",
              },
              {
                label: "Observability:",
                description:
                  "Events and their associated processing should be easily monitored with metrics and alerts.",
              },
              {
                label: "Monitoring & Recovery tooling:",
                description:
                  "Ideally, the chosen solution would provide production tools to mitigate any processing issues.",
              },
            ],
          },
          {
            type: "paragraph",
            content:
              "Compared to other solutions like Temporal, Inngest stood out as a promising candidate with the added value of its great DX and Bun support, which is the primary runtime of BÆRSkin Tactical Supply Co.'s codebase.",
          },
        ],
        image: <PlaceholderImage />,
      },
      {
        id: "third",
        title:
          "CHOOSING INNGEST: A RELIABLE EVENT-DRIVEN WORKFLOW ENGINE, COMING WITH ESSENTIAL PRODUCTION TOOLS",
        header:
          "The Inngest migration followed a strategic phased approach, beginning with a proof of concept on several peripheral workflows. Gradually, as confidence in Inngest grew, the team expanded its implementation to more business-critical systems, including order processing and analytics pipelines. After completing the full migration, the system achieved zero event loss.",
        contentBlocks: [
          {
            type: "requirements",
            requirements: [
              {
                label: "Beyond reliability:",
                description:
                  "observability, monitoring, and recovery tools - Beyond solving the reliability issues faced with Kafka, replatforming to Inngest brought a set of new advantages in operating their operational data and analytics processing in production:",
              },
            ],
            defaultSymbol: "✓",
          },
          {
            type: "quote",
            quote: {
              author: "Gus Fune → CTO",
              company: "[ BÆRSkin Tactical Supply Co. ]",
              quote:
                "The reliable transportation of events and making sure the replayability, being able to monitor how things are going, and catch things before they become a problem. Those are super important for us",
            },
          },
          {
            type: "label",
            content:
              "Using Inngest, Gus's team got access to ready-to-use monitoring dashboards, production recovery tools such as Replays  [↙]",
            imagePath: "/assets/customers/baerskin/baerskinImage.png",
          },
        ],
        image: <PlaceholderImage3 />,
      },
      {
        id: "fourth",
        title:
          "ACHIEVING 10X PERFORMANCE IMPROVEMENTS ON THEIR LOGISTICS SYSTEM",
        header:
          "Once the initial reliability issue was resolved by replatforming to Inngest, Gus and his team began exploring ways to expand Inngest to address other challenges they faced with their logistics system.",
        contentBlocks: [
          {
            type: "paragraph",
            content:
              "BÆRSkin Tactical Supply Co.'s logistics system faced a recurring challenge during Black Friday and Cyber Monday, a well-known challenge for most E-Commerce actors. The large number of orders concentrated during this short period was putting a lot of pressure on their database-based queuing system (utilizing Postgres's SKIP LOCKED design), which failed to process orders and initiate shipments in a reasonable timeframe. \n\n While short-term solutions such as drastically upscaling their infrastructure helped, Gus and his team started a PoC to evaluate the performance of their logistics system once powered by Inngest. Again, the results were there:",
          },
          {
            type: "quote",
            quote: {
              author: "Gus Fune → CTO",
              company: "[ BÆRSkin Tactical Supply Co. ]",
              quote:
                "The preliminary results show that from 40 orders per minute we managed to increase to 500 orders per minute to process in the new system. So this is probably the biggest gain we've seen in the new system",
            },
          },
        ],
      },
      {
        id: "fifth",
        title: "INNGEST FOR E-COMMERCE",
        header:
          "For BÆRSkin Tactical Supply Co., what started as a replatforming effort to address Kafka reliability issues ultimately evolved into a modernization of their analytical and operational data processing, resulting in significant gains in processing performance (a 10x faster logistics system) and operational productivity (through production tools like Replay).",
        contentBlocks: [
          {
            type: "paragraph",
            content:
              "Inngest's event-driven workflow engine bridges the gap between the two main components of E-Commerce solutions: operational data (e.g., order processing, 3rd-party integrations) and analytical data (BI) processing. Its combination of events, queuing, advanced flow control, and durable steps removes the need to combine multiple solutions to support critical E-Commerce use cases such as order processing, logistics, or BI. \n\n Finally, where alternatives like Kafka, AWS SQS, or Temporal require significant investment in infrastructure, monitoring, and production tools, Inngest comes with a fully managed and auto-scaled service that provides essential production monitoring and recovery tools.",
          },
          {
            type: "paragraph",
            content:
              "If you're interested in learning how Inngest can help your team, reach out to us to chat with an expert.",
          },
          {
            type: "cta",
            ctaText: "Read more [↗]",
            ctaDescription: "Check out other customer success stories",
          },
        ],
      },
    ],
    footer: {
      title: "Interested in Inngest?",
      subtitle: "Talk to an Inngest product expert today.",
      ctaText: "Get in touch [+]",
    },
  },
};

// Composable case study page component
function CaseStudyPage({ header, about, content }: CaseStudyPageProps) {
  return (
    <>
      <ComposableHeader {...header} />
      <ComposableAbout {...about} />
      <ComposableCaseStudy {...content} />
    </>
  );
}

// Default export for Baerskin page
export default function BaerskinTacticalPage() {
  return <CaseStudyPage {...BAERSKIN_PAGE_DATA} />;
}

// Export types and components for reuse
export type {
  CaseStudyPageProps,
  ComposableHeaderProps,
  ComposableAboutProps,
  ComposableCaseStudyProps,
  ContentSectionData,
  ContentBlock,
  InfoBlockData,
  CompanyDetailsData,
};
