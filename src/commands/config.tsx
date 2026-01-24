import { useState } from 'react';
import { Box, render, Text } from 'ink';
import { ScrollView } from 'ink-scroll-view';
import { configStore } from '../stores/config.ts';
import { NumberSetting } from '../types/setting.ts';
import { TextInput } from '../components/textInput.tsx';
import { Commands } from '../components/commands.tsx';
import { Command } from '../components/command.tsx';
import { Config as ConfigType } from '../types/config.ts';
import { useExit } from '../hooks/useExit.ts';

const height = process.stdout.rows - 4;
const initialConfig = await configStore.get();

const initialSettings = Object.entries(initialConfig.settings).map(([key, setting]) => ({
  key,
  edit: false,
  setting
}));

export function config() {
  render(<Config />);
}

export function Config() {

  const [currentIndex, setCurrentIndex] = useState(0);
  const [settingItems, setSettingItems] = useState(initialSettings);
  const [saved, setSaved] = useState(false);
  const [exit, setExit] = useExit();

  function handleUp() {
    unselect();
    setCurrentIndex(index => Math.max(0, index - 1));
  }

  function handleDown() {
    unselect();
    setCurrentIndex(index => Math.min(settingItems.length - 1, index + 1));
  }

  function handleEnter() {

    for (const settingItem of settingItems) {
      settingItem.edit = false;
    }

    const settingItem = settingItems[currentIndex];
    
    settingItem.edit = true;

    if (settingItem.setting.type === 'boolean') {
      settingItem.setting.value = !settingItem.setting.value;
    }

    setSettingItems([...settingItems]);
  }

  function handleInputChange(key: string, value: string) {

    const setting = settingItems.find(setting => setting.key === key)!.setting as NumberSetting;

    if (value === '') {
      setting.value = '';
    } else if (!isNaN(parseInt(value)) && parseInt(value) < setting.max) {
      setting.value = parseInt(value);
    }

    setSettingItems([...settingItems]);
  }

  async function handleSave() {

    const config = await configStore.get();

    config.settings = settingItems.reduce((obj, item) => ({
      ...obj,
      [item.key]: item.setting
    }), {} as ConfigType['settings']);

    await configStore.save(config);

    setSaved(true);
    setTimeout(() => setSaved(false), 500);
  }

  function handleExit() {
    setExit(true);
  }

  function unselect() {

    for (const item of settingItems) {

      item.edit = false;

      if (item.setting.type === 'number') {
        if (!item.setting.value || (typeof item.setting.value === 'number' && item.setting.value < item.setting.min)) {
          item.setting.value = item.setting.min;
        }
      }
    }

    setSettingItems([...settingItems]);
  }

  if (exit) return null;

  return (
    <Box flexDirection="column">
      <Text color='whiteBright' bold>Configuration</Text>
      <Box 
        height={settingItems.length > height ? height : undefined} 
        borderStyle='single'
        borderColor='cyan'
        borderTop={false}
        borderRight={false}
        borderBottom={false}
        marginTop={1}
        paddingLeft={1}>
        <ScrollView>
          {settingItems.map((item, index) => (
            <Box 
              key={item.key} 
              width={80}
              gap={1}
              backgroundColor={index === currentIndex ? 'black' : undefined}>
              <Box minWidth={20}>
                <Text>{item.setting.title}:</Text>
              </Box>
              <Box minWidth={6}>
                {item.setting.type === 'boolean' &&
                  <Text 
                    color='cyan'
                    inverse={item.edit}>
                    {item.setting.value ? 'true' : 'false'}
                  </Text>
                }
                {item.setting.type === 'number' &&
                  <Box>
                    {item.edit &&
                      <Text inverse color='cyan'>
                        <TextInput
                          value={item.setting.value.toString()}
                          onChange={value => handleInputChange(item.key, value)}/>
                      </Text>
                    }
                    {!item.edit &&
                      <Text 
                        color='cyan'
                        inverse={item.edit}>
                        {item.setting.value}
                      </Text>
                    }
                  </Box>
                }
              </Box>
              <Box>
                <Text color='gray' dimColor={index !== currentIndex}>{item.setting.description}</Text>
              </Box>
            </Box>
          ))}
        </ScrollView>
      </Box>
      <Box flexDirection='row' gap={1}>
        <Commands>
          <Command title='Esc (Exit)' esc onPress={handleExit}/>
          <Command title='Enter (Select)' enter onPress={handleEnter}/>
          <Command title='Ctrl+S (Save)' ctrl inputKey='s' onPress={handleSave}/>
          <Command up onPress={handleUp} />
          <Command down onPress={handleDown} />
        </Commands>
        {saved &&
          <Box marginTop={1}>
            <Text color='cyan' bold>Saved!</Text>
          </Box>
        }
      </Box>
    </Box>
  );
}
