var circle = new ProgressBar.Circle("#container", {
    color: '#A252F1',
    // This has to be the same size as the maximum width to
    // prevent clipping
    strokeWidth: 6,
    trailWidth: 2,
    easing: 'easeInOut',
    duration: 1400,
    text: {
        autoStyleContainer: false
    },
    from: {
        color: '#A252F1',
        width: 2
    },
    to: {
        color: '#A252F1',
        width: 5
    },
    // Set default step function for all animate calls
    step: function (state, circle) {
        circle.path.setAttribute('stroke', state.color);
        circle.path.setAttribute('stroke-width', state.width);

        var value = Math.round(circle.value() * 100);
        if (value === 0) {
            circle.setText('');
        } else {
            circle.setText(`${value}%`);
        }

    }
});
circle.text.style.fontFamily = '"Raleway", Helvetica, sans-serif';
circle.text.style.fontSize = '1.2rem';

circle.animate(1.0); // Number from 0.0 to 1.0