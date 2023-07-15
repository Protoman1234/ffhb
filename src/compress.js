const sharp = require('sharp');
const redirect = require('./redirect');

function compress(req, res, input) {
  const format = req.params.webp ? 'webp' : 'jpeg';

  sharp(input)
    .grayscale(req.params.grayscale)
    .toFormat(format, {
      quality: 50,
      progressive: true,
      optimizeScans: true,
      chromaSubsampling: '4:2:0'
    })
    .toBuffer((err, output, info) => {
      if (err || !info || res.headersSent) {
        return redirect(req, res);
      }

      res.setHeader('content-type', `image/${format}`);
      res.setHeader('content-length', info.size);
      res.setHeader('x-original-size', req.params.originSize);
      res.setHeader('x-bytes-saved', req.params.originSize - info.size);
      res.status(200).send(output);
    });
}

module.exports = compress;
