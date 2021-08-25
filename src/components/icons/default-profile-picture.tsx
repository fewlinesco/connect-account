import React from "react";

const DefaultProfilePictureIcon: React.FC = () => {
  return (
    <svg
      width="70"
      height="70"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      xmlnsXlink="http://www.w3.org/1999/xlink"
    >
      <rect width="70" height="70" rx="35" fill="url(#a)" />
      <defs>
        <pattern
          id="a"
          patternContentUnits="objectBoundingBox"
          width="1"
          height="1"
        >
          <use xlinkHref="#b" transform="scale(.00781)" />
        </pattern>
        <image
          id="b"
          width="128"
          height="128"
          xlinkHref="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAIAAAACACAYAAADDPmHLAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAATFSURBVHgB7ZxrbxNHFIYPzVo41CmJJbuJpbilF1IBQgjx/38BQr1AES0xwhY22GADNsTgjWDeBaPEu74QLmLP+z5SFGezs/kwz86cmXMmp9qd3hsTtHxnghoJQI4EIEcCkCMByJEA5EgAciQAORKAHAlAjgQgRwKQIwHIkQDkSAByJAA5EoAcCUCOBCBHApAjAciRAORIAHIkADkSgBwJQI4EIEcCkCMByJEA5EgAciQAORKAHAlAjgQgRwKQIwHIkQDkSAByJAA5EoAcCUBOZETEcWwP2j0bjV7YcDSyyeTQ1tdPW7QWWbVStq2ts8nPTJxi+F/B6Pj7zbY1Ww+Tz/OIosjq9W379VzdWHAvwMHB2K7fuGXj8auV2xSLp+3a1UsUo4HrGOAknQ9w//UbN0P7j2uXR1wLcJLOn4J2f/1z27zjNghst7tzOx/BXm27Eob4ok1CTNDrPbEwFabuGw5f2v69VogJds0rbgVAx82CIO/K5T+CAD8cu44VQG2nan/+fScVJDabHdcCuJwC+oNnmW//3vmfU50/BaPClct7qesQYhCe5xWXAgwGz1PXkmE/vOWLwD1bm2lB+hnP84JLAQ4y3v6sjs0CEsxy0kAyD9BsBa+6pkecwASNAMPhi5XuG4/HqWtRtGZecSnARun71DUs8xZtA0/p9vqpa+vFonnFpQBY1s2Czt9vtBa22280M+f7arVsXnE54WG+R9A3eHo8em+2Osn3+m7tWEzwTo5mkiyaBUEhcgNecZsMwtodW8FZINCDIIVCFFLCcSLKvOkBSaF5ewcecBvy4s2t7+58eOuPgs7uPe4vfQbae+584HoVsHf+XNj8qdhJQDu09477ZeDFC79/9F4+3ny0Y4CiIghgfY9VQFbWbwqmDcjifdg/Co0AUzD/Y28fxR74jIAQK4Jy6HS2XUBAJ4A4jsrCyZEA5EgAcqiiHtQJxGHn7/lMZrBQWHsfDBZD4ofrYIhbARDhP+r2k1NAg6fPQtT/eqVsIETY2DiTZBSxHNwolVyfD3C1CsAb3m4/SkrCZhNBnwKE2Nn+MckyepPBhQAoAm2ETZ7P2enzwKhQ265arVY1D+RagK/Z8bMgRXzpwm+ZNYR5IrcC3PmvkZm/XwY6DhU+UQj8CmG+x8GQeHJo8WG8ctnYUZA3yHPSKHcCIJDDuT2c2lkGArrk2HfI/ZfLqxV2QIIhAscwumBkWeV8IGIE1A3kcSs5dwLc/Pd/6yxI6KATfqqHPP7m2c+S1IEQzVZ7qQyVIBpOHeWNXAmA8363bt/N/B2i819CJm/Z4Y9P+vudrjXuteaKcO3qxdzFBLkas7pzqngwB2Mu/tJALnwh8Mw6e3g/xCQS4AsyPkjX7KNyp1Q6k6wIvhabYWqpjMrWmykhHw1HljdyJcAkPkxdQ4HHoiIPsRglg8iRAORIAHJyFQN862f0iuv5O0OomkByNAWQIwHIkQDkSAByJAA5EoAcCUCOBCBHApAjAciRAORIAHIkADkSgBwJQI4EIEcCkCMByJEA5EgAciQAORKAHAlAjgQgRwKQIwHIkQDkSAByJAA5EoAcCUCOBCBHApAjAciRAORIAHIkADkSgBwJQI4EIEcCkCMByJEA5LwF89+xm5KyNcEAAAAASUVORK5CYII="
        />
      </defs>
    </svg>
  );
};

export { DefaultProfilePictureIcon };
