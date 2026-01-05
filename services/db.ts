import { openDB } from 'idb';
import { CompetencyRow } from '../types';

const DB_NAME = 'SmartAssessmentDB';
const DB_VERSION = 1;
const STORE_NAME = 'reports';

export const initDB = async () => {
  return openDB(DB_NAME, DB_VERSION, {
    upgrade(db) {
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, { keyPath: 'id' });
      }
    },
  });
};

export const saveReportData = async (data: CompetencyRow[]) => {
  try {
    const db = await initDB();
    await db.put(STORE_NAME, {
      id: 'current_report',
      data: data,
      updatedAt: new Date().toISOString()
    });
    return true;
  } catch (error) {
    console.error('Error saving to DB:', error);
    return false;
  }
};

export const loadReportData = async (): Promise<CompetencyRow[] | null> => {
  try {
    const db = await initDB();
    const result = await db.get(STORE_NAME, 'current_report');
    return result ? result.data : null;
  } catch (error) {
    console.error('Error loading from DB:', error);
    return null;
  }
};