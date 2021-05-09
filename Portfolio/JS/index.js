



/*$(function () {
    $('a[href*=#]:not([href=#])').click(function () {
        if (location.pathname.replace(/^\//, '') == this.pathname.replace(/^\//, '') && location.hostname == this.hostname) {
            var target = $(this.hash);
            target = target.length ? target : $('[name=' + this.hash.slice(1) + ']');
            if (target.length) {
                $('html,body').animate({
                    scrollTop: target.offset().top
                }, 100);
                return false;
            }
        }
    });
});*/

function observeStickyHeaderChanges(container) {
    observeHeaders(container);
    observeFooters(container);
}
  
observeStickyHeaderChanges(document.querySelector('.slide-bar'));

function observeHeaders(container) {
    const observer = new IntersectionObserver((records, observer) => {
        for (const record of records) {
            const targetInfo = record.boundingClientRect;
            const stickyTarget = record.target.parentElement.querySelector('.sticky');
            const rootBoundsInfo = record.rootBounds;

            // Started sticking.
            if (targetInfo.bottom < rootBoundsInfo.top) {
                fireEvent(true, stickyTarget);
            }

            // Stopped sticking.
            if (targetInfo.bottom >= rootBoundsInfo.top &&
                targetInfo.bottom < rootBoundsInfo.bottom) {
                fireEvent(false, stickyTarget);
            }
        }
    }, { threshold: [0], root: container });

    // Add the top sentinels to each section and attach an observer.
    const sentinels = addSentinels(container, 'sticky_sentinel--top');
    sentinels.forEach(el => observer.observe(el));
}

function observeFooters(container) {
    const observer = new IntersectionObserver((records, observer) => {
      for (const record of records) {
        const targetInfo = record.boundingClientRect;
        const stickyTarget = record.target.parentElement.querySelector('.sticky');
        const rootBoundsInfo = record.rootBounds;
        const ratio = record.intersectionRatio;
  
        // Started sticking.
        if (targetInfo.bottom > rootBoundsInfo.top && ratio === 1) {
          fireEvent(true, stickyTarget);
        }
  
        // Stopped sticking.
        if (targetInfo.top < rootBoundsInfo.top &&
            targetInfo.bottom < rootBoundsInfo.bottom) {
          fireEvent(false, stickyTarget);
        }
      }
    }, {threshold: [1], root: container});
  
    // Add the bottom sentinels to each section and attach an observer.
    const sentinels = addSentinels(container, 'sticky_sentinel--bottom');
    sentinels.forEach(el => observer.observe(el));
}

function addSentinels(container, className) {
    return Array.from(container.querySelectorAll('.sticky')).map(el => {
      const sentinel = document.createElement('div');
      sentinel.classList.add('sticky_sentinel', className);
      return el.parentElement.appendChild(sentinel);
    });
}
  
  /**
   * Dispatches the `sticky-event` custom event on the target element.
   * @param {boolean} stuck True if `target` is sticky.
   * @param {!Element} target Element to fire the event on.
   */
  function fireEvent(stuck, target) {
    const e = new CustomEvent('sticky-change', {detail: {stuck, target}});
    document.dispatchEvent(e);
}

