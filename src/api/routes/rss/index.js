import { Router } from 'express';

import { ensureAuthenticated } from '../../../lib/util';

// different rss feed parsers
import { PDC } from '../../../lib/pdc-georss.js';
import { GDACS } from '../../../lib/gdacs-georss.js';
// import { USGS } from '../../../lib/usgs-georss.js';
// import { TSR } from '../../../lib/tsr.js';
// import { PTWC } from '../../../lib/ptwc-georss.js';
// import { LRA } from '../../../lib/lracrisistracker.js';

export default ({ logger }) => {
  let api = Router();

  // Get a list of all reports
  api.get('/', ensureAuthenticated, (req, res, next) => {
    logger.warn('++ fetching rss');
    // alerts
    const rssPromises = [PDC(), GDACS()];

    Promise.all(rssPromises)
      .then(promiseResults => {
        // combine different results into one
        let events = [];
        for (var i = 0; i < promiseResults.length; i++) {
          events = events.concat(promiseResults[i].features);
        }
        logger.warn(
          '++ : ' + JSON.stringify({ 'results.length': events.length })
        );
        res.status(200).json({
          statusCode: 200,
          time: new Date().toISOString(),
          result: events
        });
      })
      .catch(err => {
        /* istanbul ignore next */
        logger.error(err);
        /* istanbul ignore next */
        next(err);
      });
  });

  return api;
};
