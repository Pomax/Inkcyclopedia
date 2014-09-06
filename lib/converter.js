// The first two functions are from http://stackoverflow.com/questions/2353211/hsl-to-rgb-color-conversion
// which got them from http://axonflux.com/handy-rgb-to-hsl-and-rgb-to-hsv-color-model-c
// which in turn got them from http://mjijackson.com/2008/02/rgb-to-hsl-and-rgb-to-hsv-color-model-conversion-algorithms-in-javascript
// but that page no longer exists.
// The second two functions are based on http://softpixel.com/~cwright/programming/colorspace/yuv/

module.exports = {

  rgbToHSL: function (r, g, b) {
    // Assumes r, g, and b are contained in the set [0, 255] and
    // returns h, s, and l in the set [0, 1].
    r /= 255, g /= 255, b /= 255;
    var max = Math.max(r, g, b), min = Math.min(r, g, b);
    var h, s, l = (max + min) / 2;
    if(max == min) { h = s = 0; }
    else {
      var d = max - min;
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
      switch(max){
        case r: h = (g - b) / d + (g < b ? 6 : 0); break;
        case g: h = (b - r) / d + 2; break;
        case b: h = (r - g) / d + 4; break;
      }
      h /= 6;
    }
    return {h:h, s:s, l:l};
  },

  hslToRGB: (function() {
      var hue2rgb = function(p, q, t) {
        if(t < 0) t += 1;
        if(t > 1) t -= 1;
        if(t < 1/6) return p + (q - p) * 6 * t;
        if(t < 1/2) return q;
        if(t < 2/3) return p + (q - p) * (2/3 - t) * 6;
        return p;
      };

      return function(h, s, l) {
        // Assumes h, s, and l are contained in the set [0, 1] and
        // returns r, g, and b in the set [0, 255].
        var r, g, b;
        if (s == 0) { r = g = b = l; }
        else {
          var q = l < 0.5 ? l * (1 + s) : l + s - l * s;
          var p = 2 * l - q;
          r = hue2rgb(p, q, h + 1/3);
          g = hue2rgb(p, q, h);
          b = hue2rgb(p, q, h - 1/3);
        }
        return { r:(0.5 + r * 255)|0, g:(0.5 + g * 255)|0, b:(0.5 + b * 255)|0 };
      };
    }()
  ),

  rgbToYUV: function(R, G, B) {
    Y = R *  0.299000 + G *  0.587000 + B *  0.114000;
    U = R * -0.168736 + G * -0.331264 + B *  0.500000 + 128;
    V = R *  0.500000 + G * -0.418688 + B * -0.081312 + 128;
    return { y: Y, u:U, v:V };
  },

  yuvToRGB: function(Y, U, V) {
    R = Y + 1.4075 * (V - 128)
    G = Y - 0.3455 * (U - 128) - (0.7169 * (V - 128))
    B = Y + 1.7790 * (U - 128)
    return { r:R, g:G, b:B };
  }

};
