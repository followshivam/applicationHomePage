import { useEffect, useRef, useState } from "react";

export default ({ root = null, rootMargin, threshold = 0, activeClass }) => {
  const [entry, updateEntry] = useState({});
  const [node, setNode] = useState(null);

  const observer = useRef(
    new window.IntersectionObserver(([entry]) => {
      const id = entry.target.getAttribute('id') ? entry.target.getAttribute('id').substring(2) : undefined;
      if (entry.isIntersecting && entry.intersectionRatio > 0) {
        if (document.querySelector(`span[id="lt_${id}"]`) != null) {
          document.querySelector(`span[id="lt_${id}"]`).classList.add(activeClass);
          document.querySelector(`div[id="la_${id}"]`).classList.add(activeClass);
          // var myElement = document.getElementById(`l_${id}`);
          // var topPos = myElement.offsetTop;
          // myElement.parentElement.scrollTop = topPos - 30;
          // document.getElementById(`l_${id}`).parentscrollIntoView({ behavior: "smooth", block: "start", })
        }
      } else {
        if (document.querySelector(`span[id="lt_${id}"]`) != null) {
          document.querySelector(`span[id="lt_${id}"]`).classList.remove(activeClass);
          document.querySelector(`div[id="la_${id}"]`).classList.remove(activeClass);
        }
      }
    }, {
      root,
      rootMargin,
      threshold
    })
  );

  useEffect(
    () => {
      const { current: currentObserver } = observer;
      currentObserver.disconnect();

      if (node) currentObserver.observe(node);

      return () => currentObserver.disconnect();
    },
    [node]
  );

  return [setNode, entry];
};
