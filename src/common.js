'use strict';

const WarningCodes = {
  // A cache SHOULD generate this whenever the sent response is stale.
  RESPONSE_IS_STALE: 110,

  // A cache SHOULD generate this when sending a stale response because an
  // attempt to validate the response failed, due to an inability to reach
  // the server.
  REVALIDATION_FAILED: 111,

  // A cache SHOULD generate this if it is intentionally disconnected from
  // the rest of the network for a period of time.
  DISCONNECTED_OPERATION: 112,

  // A cache SHOULD generate this if it heuristically chose a freshness
  // lifetime greater than 24 hours and the response's age is greater than
  // 24 hours.
  HEURISTIC_EXPIRATION: 113,

  // The warning text can include arbitrary information to be presented to
  // a human user or logged.  A system receiving this warning MUST NOT
  // take any automated action, besides presenting the warning to the
  // user.
  MISCELLANEOUS_WARNING: 199,

  // This Warning code MUST be added by a proxy if it applies any
  // transformation to the representation, such as changing the
  // content-coding, media-type, or modifying the representation data,
  // unless this Warning code already appears in the response.
  TRANSFORMATION_APPLIED: 214,

  // The warning text can include arbitrary information to be presented to
  // a human user or logged.  A system receiving this warning MUST NOT
  // take any automated action.
  MISCELLANEOUS_PERSISTENT_WARNING: 299
};

module.exports.WarningCodes = WarningCodes;

const ApiWarningCodes = {
  //
  DEPRECATED: 300,

  //
  PENDING_DEPRECATION: 310,

  //
  SCHEDULED_DEPRECATION: 320,

  //
  NEW_VERSION_AVAILABLE: 400,

  //
  MAINTENANCE: 500,

  //
  SCHEDULED_MAINTENANCE: 510,

  //
  UNSCHEDULED_MAINTENANCE: 520,

  //
  SERVICE_DEGRADATION: 530,

  //
  OUTAGE_PARTIAL: 540,

  //
  OUTAGE_ZONAL: 550,

  //
  OUTAGE_REGIONAL: 560,

  //
  OUTAGE_GLOBAL: 570
};

module.exports.ApiWarningCodes = ApiWarningCodes;

module.exports.isValidDate = (value) => {
  let d = new Date(value);
  return false === isNaN(Date.parse(value)) &&
    null !== d.toJSON() &&
    d.toString() !== 'Invalid Date';
};
