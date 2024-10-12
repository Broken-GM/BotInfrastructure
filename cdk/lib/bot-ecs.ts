import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as ecs from 'aws-cdk-lib/aws-ecs';
import * as ec2 from 'aws-cdk-lib/aws-ec2';
import * as ecr from 'aws-cdk-lib/aws-ecr';
import * as iam from 'aws-cdk-lib/aws-iam';

export class EcsStack extends cdk.Stack {
    constructor(scope: Construct, id: string, props?: cdk.StackProps) {
        super(scope, id, props);
        
        // // ECS IAM Role
        // const taskRole = new iam.Role(this, 'main-broken-gm-bot-ecs-role', {
        //     roleName: 'main-broken-gm-bot-ecs',
        //     assumedBy: new iam.ServicePrincipal('ecs-tasks.amazonaws.com')
        // });

        // Create an ECS cluster within the VPC
        // const cluster = new ecs.Cluster(this, 'main-broken-gm-bot-ecs-cluster', {
        //     vpc,
        //     clusterName: 'main-broken-gm-bot'
        // });
    }
}
