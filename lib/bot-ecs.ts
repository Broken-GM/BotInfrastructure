import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as ec2 from 'aws-cdk-lib/aws-ec2';
import * as ecs from 'aws-cdk-lib/aws-ecs';
import * as ecr from 'aws-cdk-lib/aws-ecr';

interface EcsTaskStackProps extends cdk.StackProps {
    ecrRepoName: string;
    vpc: ec2.IVpc;
    subnet: ec2.ISubnet;
    securityGroup: ec2.ISecurityGroup;
}

export class EcsStack extends cdk.Stack {
    constructor(scope: Construct, id: string, props: EcsTaskStackProps) {
        super(scope, id, props);
        
        // Grab ECR Repo
        const repository = ecr.Repository.fromRepositoryName(
            this,
            'main-broken-gm-bot-ecs-ecr-repo',
            props.ecrRepoName
        );

        // Create ECS Cluster
        const cluster = new ecs.Cluster(this, 'main-broken-gm-bot-ecs-cluster', {});
        cluster.addCapacity('main-broken-gm-bot-ecs-scaling-group', {
            instanceType: ec2.InstanceType.of(ec2.InstanceClass.T2, ec2.InstanceSize.MICRO),
            desiredCapacity: 1,
        });

        // Create ECS Task
        const taskDefinition = new ecs.Ec2TaskDefinition(this, 'main-broken-gm-bot-ecs-task');
        const container = taskDefinition.addContainer('main-broken-gm-bot-ecs-task-container', {
            image: ecs.ContainerImage.fromEcrRepository(repository),
            memoryLimitMiB: 512,
            cpu: 256,
            logging: new ecs.AwsLogDriver({ streamPrefix: 'main-broken-gm-bot-ecs-task-container' })
        });

        new ecs.Ec2Service(this, 'main-broken-gm-bot-ecs-service', {
            cluster: cluster,
            taskDefinition: taskDefinition,
        });
    }
}
