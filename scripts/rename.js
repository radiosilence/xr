var fs = require('fs');

fs.rename('./xr.d.ts', './index.d.ts', function(err) {
    if (err) throw err
});
