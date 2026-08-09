import mongoose from 'mongoose';

export interface ReportDataSource {
  getCollectionData(collectionName: string, query: Record<string, unknown>): Promise<unknown[]>;
}

export class MongooseReportDataSource implements ReportDataSource {
  async getCollectionData(collectionName: string, query: Record<string, unknown>): Promise<unknown[]> {
    if (!mongoose.connection.db) {
      return [];
    }

    const collections = await mongoose.connection.db.listCollections({ name: collectionName }).toArray();
    if (collections.length === 0) {
      return []; // Collection does not exist yet (Dev1/Dev2 not integrated)
    }

    return mongoose.connection.db.collection(collectionName).find(query).toArray();
  }
}

export const getReportDataSource = (): ReportDataSource => {
  return new MongooseReportDataSource();
};
