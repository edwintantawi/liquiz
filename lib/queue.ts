import { PubSub as GoogleCloudPubSub } from '@google-cloud/pubsub';

import { env } from '~/lib/env.mjs';

export const pubSubClient = new GoogleCloudPubSub();

class Queue {
  private pubSubClient: GoogleCloudPubSub;
  public topicName: string;

  constructor({ topicName }: { topicName: string }) {
    this.pubSubClient = new GoogleCloudPubSub();
    this.topicName = topicName;
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  async publish(data: any) {
    const messageId = await this.pubSubClient
      .topic(this.topicName)
      .publishMessage({ json: data });

    return messageId;
  }
}

export const tasksQueue = new Queue({
  topicName: env.GCP_PUBSUB_TOPIC_NAME,
});

export const historySummaryQueue = new Queue({
  topicName: env.GCP_PUBSUB_HISTORY_SUMMARY_TOPIC_NAME,
});
