import { useEffect, useRef } from 'react';
import { useAppDispatch, useAppSelector } from './redux';
import { fetchStandings } from '../store/standingsSlice';

export const useStandingsAutoUpdate = (interval: number = 30000) => {
  const dispatch = useAppDispatch();
  const { selectedLeagueId } = useAppSelector(state => state.standings);
  const { results } = useAppSelector(state => state.results);
  const intervalRef = useRef<NodeJS.Timeout>();
  const lastResultsLengthRef = useRef(results.length);

  useEffect(() => {
    if (results.length !== lastResultsLengthRef.current) {
      dispatch(fetchStandings(selectedLeagueId || undefined));
      lastResultsLengthRef.current = results.length;
    }
  }, [dispatch, results.length, selectedLeagueId]);

  useEffect(() => {
    const refreshStandings = () => {
      dispatch(fetchStandings(selectedLeagueId || undefined));
    };

    intervalRef.current = setInterval(refreshStandings, interval);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [dispatch, selectedLeagueId, interval]);

  return {
    refreshStandings: () => dispatch(fetchStandings(selectedLeagueId || undefined))
  };
};