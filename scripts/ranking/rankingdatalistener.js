/**
 * RankingDataListener: Strange name, but it is registered through the
 * dependency system to a RankingModel, from where it catches recalc events,
 * which it uses to update a single field of data, e.g. wins, points, saldo, ...
 *
 * @return RankingDataListener
 * @author Erik E. Lorenz <erik@tuvero.de>
 * @license MIT License
 * @see LICENSE
 */
define(['lib/extend', 'core/listener'], function (extend, Listener) {
  /**
   * Constructor.
   *
   * Subclasses are required to create "ranking.{NAME}" in the constructor
   *
   * @param ranking
   *          a RankingModel instance
   * @param fieldobject
   *          the object for the field this class is calculating
   */
  function RankingDataListener (ranking, fieldobject) {
    var Const
    RankingDataListener.superconstructor.call(this)

    /**
     * This.constructor, on inherited classes, is NOT RankingDataListener, but
     * the constructor that was invoked by 'new'
     */
    Const = this.constructor

    this.ranking = ranking

    // resize and map the ranking field
    if (fieldobject.length !== ranking.length) {
      fieldobject.resize(ranking.length)
    }
    if (ranking[Const.NAME] !== undefined) {
      throw new Error('ranking field already exists: ' + Const.NAME)
    }
    ranking[Const.NAME] = fieldobject
    this[Const.NAME] = fieldobject

    // create dependency links
    if (Const.DEPENDENCIES) {
      Const.DEPENDENCIES.forEach(function (DEPNAME) {
        this[DEPNAME] = ranking[DEPNAME]
        if (this[DEPNAME] === undefined) {
          console.warn('ranking dependency not found: ' + DEPNAME)
        }
      }, this)
    }

    ranking.registerListener(this)
  }
  extend(RankingDataListener, Listener)

  /**
   * detect whether this specific instance is a primary data listener, or is
   * only processing recalc events, i.e. processing data of other data listeners
   *
   * @return true if this listener contains primary data, false otherwise
   */
  RankingDataListener.prototype.isPrimary = function () {
    return this.onbye !== RankingDataListener.prototype.onbye ||
      this.onresult !== RankingDataListener.prototype.onresult
  }

  /**
   * the name of the field, which is handled by this class, e.g. 'wins'
   */
  RankingDataListener.NAME = 'undefined'

  /**
   * an array of dependencies, e.g. [ 'buchholz', 'games'] for finebuchholz
   */
  RankingDataListener.DEPENDENCIES = []

  RankingDataListener.prototype.destroy = function () {
    RankingDataListener.superclass.destroy.call(this)

    delete this.ranking[this.constructor.NAME]
  }

  /**
   * insert the results of a game into the ranking.
   *
   * @param r
   *          the emitting RankingModel instance. Please ignore.
   * @param e
   *          the name of the emitted event
   * @param game
   *          a game result
   */
  RankingDataListener.prototype.onresult = function (r, e, game) {
    // do something to this.NAME, where NAME is the value of constructor.NAME
  }

  /**
   * inserts a bye into the ranking
   *
   * @param r
   *          the emitting RankingModel instance. Please ignore.
   * @param e
   *          the name of the emitted event
   * @param teams
   *          array of teams which receive a bye
   */
  RankingDataListener.prototype.onbye = function (r, e, data) {
    var teams, round
    teams = data.teams
    round = data.round
    // do something to this.NAME, where NAME is the value of constructor.NAME
  }

  /**
   * correct a ranking entry. Do not check whether it's valid. The
   * TournamentModel has to take care of that
   *
   * @param r
   *          the emitting RankingModel instance. Please ignore.
   * @param e
   *          the name of the emitted event
   * @param correction
   *          a game correction (CorrectionModel instance)
   */
  RankingDataListener.prototype.oncorrect = function (r, e, correction) {
    // do something to this.NAME, where NAME is the value of constructor.NAME
  }

  /**
   * calculate the field
   */
  RankingDataListener.prototype.onrecalc = function () {
    // do something to this.NAME, where NAME is the value of constructor.NAME
  }

  RankingDataListener.prototype.zero = function () {
    var data = this[this.constructor.NAME]
    if (data.fill) {
      data.fill(0)
    }
  }

  /**
   * reset the field
   */
  RankingDataListener.prototype.onreset = function () {
    this.zero()
  }

  /**
   * resize the contents
   *
   * @param ranking
   */
  RankingDataListener.prototype.onresize = function (ranking) {
    var dataobject = this[this.constructor.NAME]
    if (dataobject && dataobject.resize) {
      this[this.constructor.NAME].resize(ranking.length)
    }
  }

  return RankingDataListener
})
