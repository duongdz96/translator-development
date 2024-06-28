import * as React from 'react';
import Svg, { Path } from 'react-native-svg';

function IconProfile(props) {
  return (
    <Svg
      width='22'
      height='22'
      viewBox='0 0 22 22'
      fill='none'
      xmlns='http://www.w3.org/2000/svg'>
      <Path
        d='M13.0789 0.5C13.2377 0.500005 13.3924 0.550406 13.5207 0.643944C13.649 0.737482 13.7443 0.86933 13.7929 1.0205L14.6179 3.584C14.9644 3.7535 15.2959 3.944 15.6124 4.1585L18.2464 3.5915C18.4017 3.55834 18.5635 3.57534 18.7086 3.64003C18.8536 3.70473 18.9743 3.81379 19.0534 3.9515L21.1324 7.55C21.2118 7.68763 21.2454 7.84693 21.2284 8.0049C21.2115 8.16288 21.1447 8.31139 21.0379 8.429L19.2304 10.424C19.2567 10.8065 19.2567 11.1905 19.2304 11.573L21.0379 13.571C21.1447 13.6886 21.2115 13.8371 21.2284 13.9951C21.2454 14.1531 21.2118 14.3124 21.1324 14.45L19.0534 18.05C18.9741 18.1874 18.8533 18.2962 18.7083 18.3606C18.5633 18.425 18.4016 18.4418 18.2464 18.4085L15.6124 17.8415C15.2974 18.0545 14.9644 18.2465 14.6194 18.416L13.7929 20.9795C13.7443 21.1307 13.649 21.2625 13.5207 21.3561C13.3924 21.4496 13.2377 21.5 13.0789 21.5H8.92092C8.76213 21.5 8.60744 21.4496 8.47913 21.3561C8.35082 21.2625 8.25551 21.1307 8.20692 20.9795L7.38342 18.4175C7.03785 18.2485 6.70453 18.0555 6.38592 17.84L3.75342 18.4085C3.59812 18.4417 3.4363 18.4247 3.29127 18.36C3.14624 18.2953 3.0255 18.1862 2.94642 18.0485L0.867418 14.45C0.78803 14.3124 0.754404 14.1531 0.771388 13.9951C0.788372 13.8371 0.855089 13.6886 0.961918 13.571L2.76942 11.573C2.74324 11.1914 2.74324 10.8086 2.76942 10.427L0.961918 8.429C0.855089 8.31139 0.788372 8.16288 0.771388 8.0049C0.754404 7.84693 0.78803 7.68763 0.867418 7.55L2.94642 3.95C3.02571 3.81256 3.14656 3.70381 3.29156 3.63939C3.43657 3.57497 3.59828 3.55821 3.75342 3.5915L6.38592 4.16C6.70392 3.9455 7.03692 3.752 7.38342 3.5825L8.20842 1.0205C8.25685 0.869817 8.35171 0.738318 8.47942 0.644825C8.60713 0.551332 8.76114 0.500639 8.91942 0.5H13.0774H13.0789ZM12.5299 2H9.46992L8.61792 4.6505L8.04342 4.931C7.76099 5.06921 7.48836 5.22657 7.22742 5.402L6.69642 5.762L3.97242 5.174L2.44242 7.826L4.30992 9.893L4.26492 10.529C4.24337 10.8426 4.24337 11.1574 4.26492 11.471L4.30992 12.107L2.43942 14.174L3.97092 16.826L6.69492 16.2395L7.22592 16.598C7.48686 16.7734 7.75949 16.9308 8.04192 17.069L8.61642 17.3495L9.46992 20H12.5329L13.3879 17.348L13.9609 17.069C14.243 16.9311 14.5152 16.7737 14.7754 16.598L15.3049 16.2395L18.0304 16.826L19.5604 14.174L17.6914 12.107L17.7364 11.471C17.758 11.1569 17.758 10.8416 17.7364 10.5275L17.6914 9.8915L19.5619 7.826L18.0304 5.174L15.3049 5.759L14.7754 5.402C14.5152 5.22622 14.2431 5.06884 13.9609 4.931L13.3879 4.652L12.5314 2H12.5299ZM10.9999 6.5C12.1934 6.5 13.338 6.97411 14.1819 7.81802C15.0258 8.66193 15.4999 9.80653 15.4999 11C15.4999 12.1935 15.0258 13.3381 14.1819 14.182C13.338 15.0259 12.1934 15.5 10.9999 15.5C9.80644 15.5 8.66185 15.0259 7.81794 14.182C6.97402 13.3381 6.49992 12.1935 6.49992 11C6.49992 9.80653 6.97402 8.66193 7.81794 7.81802C8.66185 6.97411 9.80644 6.5 10.9999 6.5ZM10.9999 8C10.2043 8 9.44121 8.31607 8.8786 8.87868C8.31599 9.44129 7.99992 10.2044 7.99992 11C7.99992 11.7956 8.31599 12.5587 8.8786 13.1213C9.44121 13.6839 10.2043 14 10.9999 14C11.7956 14 12.5586 13.6839 13.1212 13.1213C13.6838 12.5587 13.9999 11.7956 13.9999 11C13.9999 10.2044 13.6838 9.44129 13.1212 8.87868C12.5586 8.31607 11.7956 8 10.9999 8Z'
        fill='#82828B'
      />
    </Svg>
  );
}

export default IconProfile;
