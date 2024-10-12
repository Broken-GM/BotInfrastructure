import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as ecr from 'aws-cdk-lib/aws-ecr';

export class EcrStack extends cdk.Stack {
  public readonly backendServiceRepository: ecr.IRepository;

  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);
    this.backendServiceRepository = this.createEcr(`main-bot`);
  }

  createEcr(repositoryName: string): ecr.IRepository {
    return new ecr.Repository(this, `${repositoryName}`, { repositoryName });
  }
}
