import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as ecr from 'aws-cdk-lib/aws-ecr';

export class EcrStack extends cdk.Stack {
  public readonly ecrRepoName: string;

  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const ecrRepo = new ecr.Repository(this, 'main-broken-gm-bot-ecr-repo', { repositoryName: 'main-broken-gm-bot-ecr' });
    this.ecrRepoName = ecrRepo.repositoryName
  }
}
