/**
 * Pushes analytics data to any analytic service
 * @function analytics
 * @param  {Function} [options.pushFunction] Push function called when data are supposed to be pushed to analytic service
 * @param  {int} [options.delay=3000] Number of milliseconds between last search key stroke and calling pushFunction
 * @param  {boolean} [options.triggerOnUIInteraction=false] Trigger pushFunction after click on page or redirecting the page
 * @return {Object}
 */
const usage = `Usage:
analytics({
  pushFunction,
  [ delay=3000 ],
  [ triggerOnUIInteraction=false ]
})`;
function analytics({
  pushFunction,
  delay = 3000,
  triggerOnUIInteraction = false,
} = {}) {

  if (!pushFunction) {
    throw new Error(usage);
  }

  let cachedState = null;

  let lastSentData = '';
  let sendAnalytics = function(state) {
    if(state === null) {
      return;
    }

    let formattedParams = [];

    let serializedRefinements = serializeRefinements(Object.assign({}, state.state.disjunctiveFacetsRefinements, state.state.facetsRefinements, state.state.hierarchicalFacetsRefinements));
    let serializedNumericRefinements  = serializeNumericRefinements(state.state.numericRefinements);

    if(serializedRefinements !== '') {
      formattedParams.push(serializedRefinements);
    }

    if(serializedNumericRefinements !== '') {
      formattedParams.push(serializedNumericRefinements);
    }

    formattedParams = formattedParams.join('&');

    let dataToSend = 'Query: ' + state.state.query + ', ' + formattedParams;

    if(lastSentData !== dataToSend) {
      pushFunction(formattedParams, state.state, state.results);

      lastSentData = dataToSend;
    }
  };

  let serializeRefinements = function(obj) {
    let str = [];
    for(let p in obj) {
      if (obj.hasOwnProperty(p)) {
        let values = obj[p].join('+');
        str.push(encodeURIComponent(p) + '=' + encodeURIComponent(p) + '_' + encodeURIComponent(values));
      }
    }

    return str.join('&');
  };

  let serializeNumericRefinements = function(numericRefinements) {
    let numericStr = [];

    for(let attr in numericRefinements) {
      if(numericRefinements.hasOwnProperty(attr)) {
        let filter = numericRefinements[attr];

        if(filter.hasOwnProperty('>=') && filter.hasOwnProperty('<=')) {
          if(filter['>='][0] == filter['<='][0]) {
            numericStr.push(attr + '=' + attr + '_' + filter['>=']);
          }
          else {
            numericStr.push(attr + '=' + attr + '_' + filter['>='] + 'to' + filter['<=']);
          }
        }
        else if(filter.hasOwnProperty('>=')) {
          numericStr.push(attr + '=' + attr + '_from' + filter['>=']);
        }
        else if(filter.hasOwnProperty('<=')) {
          numericStr.push(attr + '=' + attr + '_to' + filter['<=']);
        }
        else if(filter.hasOwnProperty('=')) {
          let equals = [];
          for(let equal in filter['=']) {
            if(filter['='].hasOwnProperty(equal)) {
              equals.push(filter['='][equal]);
            }
          }

          numericStr.push(attr + '=' + attr + '_' + equals.join('-'));
        }
      }
    }

    return numericStr.join('&');
  };

  let pushTimeout;

  return {
    init() {
      if(triggerOnUIInteraction === true) {
        document.addEventListener('click', function() {
          sendAnalytics(cachedState);
        });

        window.addEventListener('beforeunload', function() {
          sendAnalytics(cachedState);
        });
      }
    },
    render({results, state}) {
      cachedState = {
        results: results,
        state: state,
      };

      if(pushTimeout) {
        clearTimeout(pushTimeout);
      }

      pushTimeout = setTimeout(() => sendAnalytics(cachedState), delay);
    },
  };
}

export default analytics;
