import { Router } from 'express';

// Import our data model
import events from './model';
import missions from './../missions/model';

// Import any required utility functions
import { cacheResponse, handleGeoResponse, ensureAuthenticated, ensureAuthenticatedWrite } from '../../../lib/util';

// Import validation dependencies
import { celebrate as validate, Joi } from 'celebrate';

export default ({ config, db, logger }) => {
    let api = Router();

    // Get a list of all events
    api.get('/', ensureAuthenticated, cacheResponse('1 minute'),
        validate({
            query: {
                geoformat: Joi.any().valid(config.GEO_FORMATS).default(config.GEO_FORMAT_DEFAULT),
                status: Joi.any().valid(config.API_EVENT_STATUS_TYPES),
                country: Joi.string()
            }
        }),
        (req, res, next) => events(config, db, logger).all(req.query.status, req.query.country)
            .then((data) => handleGeoResponse(data, req, res, next))
            .catch((err) => {
                /* istanbul ignore next */
                logger.error(err);
                /* istanbul ignore next */
                next(err);
            })
    );

    // Get a single event
    api.get('/:id',ensureAuthenticated, cacheResponse('1 minute'),
        validate({
            params: { id: Joi.number().integer().min(1).required() } ,
            query: {
                geoformat: Joi.any().valid(config.GEO_FORMATS).default(config.GEO_FORMAT_DEFAULT)
            }
        }),
        (req, res, next) => events(config, db, logger).byId(req.params.id)
            .then((data) => handleGeoResponse(data, req, res, next))
            .catch((err) => {
                /* istanbul ignore next */
                logger.error(err);
                /* istanbul ignore next */
                next(err);
            })
    );

    // Create a new event record in the database
    api.post('/',ensureAuthenticatedWrite,
        validate({
            body: Joi.object().keys({
                status: Joi.string().valid(config.API_EVENT_STATUS_TYPES).required(),
                type: Joi.string().required(),
                report_id: Joi.number().min(1),
                created_at: Joi.date().iso().required(),
                metadata: Joi.object().required(),
                location: Joi.object().required().keys({
                    lat: Joi.number().min(-90).max(90).required(),
                    lng: Joi.number().min(-180).max(180).required()
                })
            })
        }),
        (req, res, next) => {
            events(config, db, logger).createEvent(req.body)
                .then((data) => handleGeoResponse(data, req, res, next))
                .catch((err) => {
                    /* istanbul ignore next */
                    logger.error(err);
                    /* istanbul ignore next */
                    next(err);
                });
        }
    );

    // Update an event record in the database
    api.put('/:id',ensureAuthenticatedWrite,
        validate({
            params: { id: Joi.number().integer().min(1).required() } ,
            body: Joi.object().keys({
                status: Joi.string().valid(config.API_EVENT_STATUS_TYPES).required(),
                type: Joi.string().required(),
                metadata: Joi.object().required()
            })
        }),
        (req, res, next) => {
            events(config, db, logger).updateEvent(req.params.id, req.body)
                .then((data) => {
                    if (req.body.status === 'inactive') {
                        // backfill location for compatibility
                        console.log(data); // eslint-disable-line no-console
                        req.body['location'] = {'lat': data.lat, 'lng': data.lng};
                        missions(config, db, logger).createMission(req.body)
                            .then((data) => handleGeoResponse(data, req, res, next))
                            .catch((err) => {
                                /* istanbul ignore next */
                                logger.error(err);
                                /* istanbul ignore next */
                                next(err);
                            });
                    } else {
                        handleGeoResponse(data, req, res, next);
                    }
                })
                .catch((err) => {
                    /* istanbul ignore next */
                    logger.error(err);
                    /* istanbul ignore next */
                    next(err);
                });
        }
    );

    // Update an event record's location in the database
    api.patch('/updatelocation/:id',ensureAuthenticatedWrite,
        validate({
            params: { id: Joi.number().integer().min(1).required() } ,
            body: Joi.object().keys({
                location: Joi.object().required().keys({
                    lat: Joi.number().min(-90).max(90).required(),
                    lng: Joi.number().min(-180).max(180).required()
                })
            })
        }),
        (req, res, next) => {
            events(config, db, logger).updateLocation(req.params.id, req.body)
                .then((data) => {
                    handleGeoResponse(data, req, res, next);

                })
                .catch((err) => {
                    /* istanbul ignore next */
                    logger.error(err);
                    /* istanbul ignore next */
                    next(err);
                });
        }
    );

    return api;
};
