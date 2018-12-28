/**
 * Display tournament-related errors as Toasts
 *
 * @author Erik E. Lorenz <erik@tuvero.de>
 * @license MIT License
 * @see LICENSE
 */
define(['ui/state', 'ui/listcollectormodel', 'tournament/tournamentmodel',
  'ui/toast', 'ui/strings'], function (State, ListCollectorModel,
  TournamentModel, Toast, Strings) {
  var TournamentErrorToasts

  // save on player name change
  TournamentErrorToasts = new ListCollectorModel(State.tournaments,
    TournamentModel)
  TournamentErrorToasts.onerror = function (emitter, event, message) {
    return new Toast(Strings.tournamenterrorprefix + ': ' + message, //
      Toast.LONG)
  }

  return TournamentErrorToasts
})
