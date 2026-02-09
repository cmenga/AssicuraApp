
export type ColorsState = "active" | "expired" | "approved" | "refused" | "expiring" | "inProgress"

/**
 * The function `getStatusColor` returns a color class based on the state provided in the `ColorsState`
 * enum.
 * 
 * Args:
 *   state (ColorsState): The `getStatusColor` function takes a `state` parameter of type
 *    `ColorsState`. The function returns a color class based on the provided `state`. The possible values
 *    for `state` and their corresponding color classes are defined in the `colors` object within the
 *    function.
 * 
 * Returns:
 *   The function `getStatusColor` returns a string representing the color classes based on the input
 *   `state` value. If the `state` matches one of the keys in the `colors` object, it returns the
 *   corresponding color classes. If there is no match, it returns the default color classes "bg-gray-100
 *   text-gray-700".
 */
export function getStatusColor (state: ColorsState) {
  const colors = {
    active: "bg-green-100 text-green-700",
    expiring: "bg-orange-100 text-orange-700",
    expired: "bg-red-100 text-red-700",
    inProgress: "bg-blue-100 text-blue-700",
    approved: "bg-green-100 text-green-700",
    refused: "bg-red-100 text-red-700",
  };
  return colors[state] || "bg-gray-100 text-gray-700";
};
