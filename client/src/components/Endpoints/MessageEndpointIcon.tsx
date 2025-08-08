import { memo } from 'react';
import { Feather } from 'lucide-react';
import { EModelEndpoint, isAssistantsEndpoint, alternateName } from 'librechat-data-provider';
import {
  Plugin,
  GPTIcon,
  PaLMIcon,
  CodeyIcon,
  GeminiIcon,
  BedrockIcon,
  AssistantIcon,
  AnthropicIcon,
  AzureMinimalIcon,
  CustomMinimalIcon,
} from '@librechat/client';
import UnknownIcon from '~/hooks/Endpoint/UnknownIcon';
import { IconProps } from '~/common';
import { cn } from '~/utils';

type EndpointIcon = {
  icon: React.ReactNode | React.JSX.Element;
  bg?: string;
  name?: string | null;
};

function getOpenAIColor(_model: string | null | undefined) {
  const model = _model?.toLowerCase() ?? '';
  if (model && (/\b(o\d)\b/i.test(model) || /\bgpt-[5-9]\b/i.test(model))) {
    return '#000000';
  }
  return model.includes('gpt-4') ? '#AB68FF' : '#19C37D';
}

function getGoogleIcon(model: string | null | undefined, size: number) {
  if (model?.toLowerCase().includes('code') === true) {
    return <CodeyIcon size={size * 0.75} />;
  } else if (/gemini|learnlm|gemma/.test(model?.toLowerCase() ?? '')) {
    return <GeminiIcon size={size * 0.7} />;
  } else {
    return <PaLMIcon size={size * 0.7} />;
  }
}

function getGoogleModelName(model: string | null | undefined) {
  if (model?.toLowerCase().includes('code') === true) {
    return 'Codey';
  } else if (
    model?.toLowerCase().includes('gemini') === true ||
    model?.toLowerCase().includes('learnlm') === true
  ) {
    return 'Gemini';
  } else if (model?.toLowerCase().includes('gemma') === true) {
    return 'Gemma';
  } else {
    return 'PaLM2';
  }
}

const MessageEndpointIcon: React.FC<IconProps> = (props) => {
  const {
    error,
    button,
    iconURL = '',
    endpoint,
    size = 30,
    model = '',
    assistantName,
    agentName,
  } = props;

  const assistantsIcon = {
    icon: iconURL ? (
      <div className="relative flex h-6 w-6 items-center justify-center">
        <div
          title={assistantName}
          style={{
            width: size,
            height: size,
          }}
          className={cn('overflow-hidden rounded-full', props.className ?? '')}
        >
          <img
            className="shadow-stroke h-full w-full object-cover"
            src={iconURL}
            alt={assistantName}
            style={{ height: '80', width: '80' }}
          />
        </div>
      </div>
    ) : (
      <div className="h-6 w-6">
        <div className="shadow-stroke flex h-6 w-6 items-center justify-center overflow-hidden rounded-full">
          <AssistantIcon className="h-2/3 w-2/3 text-gray-400" />
        </div>
      </div>
    ),
    name: endpoint,
  };

  const agentsIcon = {
    icon: iconURL ? (
      <div className="relative flex h-6 w-6 items-center justify-center">
        <div
          title={agentName}
          style={{
            width: size,
            height: size,
          }}
          className={cn('overflow-hidden rounded-full', props.className ?? '')}
        >
          <img
            className="shadow-stroke h-full w-full object-cover"
            src={iconURL}
            alt={agentName}
            style={{ height: '80', width: '80' }}
          />
        </div>
      </div>
    ) : (
      <div className="h-6 w-6">
        <div className="shadow-stroke flex h-6 w-6 items-center justify-center overflow-hidden rounded-full">
          <svg className="lucide lucide-feather icon-sm" width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M16.8311 15.6402C17.5011 15.2002 18.3811 15.6802 18.3811 16.4802V17.7702C18.3811 19.0402 17.3911 20.4002 16.2011 20.8002L13.0111 21.8602C12.4511 22.0502 11.5411 22.0502 10.9911 21.8602L7.80109 20.8002C6.60109 20.4002 5.62109 19.0402 5.62109 17.7702V16.4702C5.62109 15.6802 6.50109 15.2002 7.16109 15.6302L9.22109 16.9702C10.0111 17.5002 11.0111 17.7602 12.0111 17.7602C13.0111 17.7602 14.0111 17.5002 14.8011 16.9702L16.8311 15.6402Z" fill="#292D32"/>
<path d="M19.9795 6.45859L13.9895 2.52859C12.9095 1.81859 11.1295 1.81859 10.0495 2.52859L4.02953 6.45859C2.09953 7.70859 2.09953 10.5386 4.02953 11.7986L5.62953 12.8386L10.0495 15.7186C11.1295 16.4286 12.9095 16.4286 13.9895 15.7186L18.3795 12.8386L19.7495 11.9386V14.9986C19.7495 15.4086 20.0895 15.7486 20.4995 15.7486C20.9095 15.7486 21.2495 15.4086 21.2495 14.9986V10.0786C21.6495 8.78859 21.2395 7.28859 19.9795 6.45859Z" fill="#292D32"/>
</svg>
        </div>
      </div>
    ),
    name: endpoint,
  };

  const endpointIcons: {
    [key: string]: EndpointIcon | undefined;
  } = {
    [EModelEndpoint.assistants]: assistantsIcon,
    [EModelEndpoint.agents]: agentsIcon,
    [EModelEndpoint.azureAssistants]: assistantsIcon,
    [EModelEndpoint.azureOpenAI]: {
      icon: <AzureMinimalIcon size={size * 0.5555555555555556} />,
      bg: 'linear-gradient(0.375turn, #61bde2, #4389d0)',
      name: 'ChatGPT',
    },
    [EModelEndpoint.openAI]: {
      icon: <GPTIcon size={size * 0.5555555555555556} />,
      bg: getOpenAIColor(model),
      name: 'ChatGPT',
    },
    [EModelEndpoint.gptPlugins]: {
      icon: <Plugin size={size * 0.7} />,
      bg: `rgba(69, 89, 164, ${button === true ? 0.75 : 1})`,
      name: 'Plugins',
    },
    [EModelEndpoint.google]: {
      icon: getGoogleIcon(model, size),
      name: getGoogleModelName(model),
    },
    [EModelEndpoint.anthropic]: {
      icon: <AnthropicIcon size={size * 0.5555555555555556} />,
      bg: '#d09a74',
      name: 'Claude',
    },
    [EModelEndpoint.bedrock]: {
      icon: <BedrockIcon className="icon-xl text-white" />,
      bg: '#268672',
      name: alternateName[EModelEndpoint.bedrock],
    },
    [EModelEndpoint.custom]: {
      icon: <CustomMinimalIcon size={size * 0.7} />,
      name: 'Custom',
    },
    null: { icon: <GPTIcon size={size * 0.7} />, bg: 'grey', name: 'N/A' },
    default: {
      icon: (
        <div className="h-6 w-6">
          <div className="overflow-hidden rounded-full">
            <UnknownIcon
              iconURL={iconURL}
              endpoint={endpoint ?? ''}
              className="h-full w-full object-contain"
              context="message"
            />
          </div>
        </div>
      ),
      name: endpoint,
    },
  };

  let { icon, bg, name } =
    endpoint != null && endpoint && endpointIcons[endpoint]
      ? (endpointIcons[endpoint] ?? {})
      : (endpointIcons.default as EndpointIcon);

  if (iconURL && endpointIcons[iconURL]) {
    ({ icon, bg, name } = endpointIcons[iconURL]);
  }

  if (isAssistantsEndpoint(endpoint)) {
    return icon;
  }

  return (
    <div
      title={name ?? ''}
      style={{
        background: bg != null ? bg || 'transparent' : 'transparent',
        width: size,
        height: size,
      }}
      className={cn(
        'relative flex h-9 w-9 items-center justify-center rounded-sm p-1 text-white',
        props.className ?? '',
      )}
    >
      {icon}
      {error === true && (
        <span className="absolute right-0 top-[20px] -mr-2 flex h-3 w-3 items-center justify-center rounded-full border border-white bg-red-500 text-[10px] text-white">
          !
        </span>
      )}
    </div>
  );
};

export default memo(MessageEndpointIcon);
