import connectCurrentRefinements from '../connectors/connectCurrentRefinements.js';
import CurrentRefinementsComponent from '../components/CurrentRefinements.js';

/**
 * The CurrentRefinements widget displays the list of filters currently applied to the search parameters.
 * It also lets the user remove each one of them.
 * @name CurrentRefinements
 * @kind component
 * @category widget
 * @themeKey root - the root div of the widget
 * @themeKey filters - the container of the filters
 * @themeKey filter - a single filter
 * @themeKey filterLabel - the label of a filter
 * @themeKey filterClear - the trigger to remove the filter
 * @themeKey clearAll - the atomic option
 * @translationKey clearFilter - the label?
 * @translationKey clearAll - the clear all button value
 */
export default connectCurrentRefinements(CurrentRefinementsComponent);